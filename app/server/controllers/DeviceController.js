const mongoose = require('mongoose')
const DeviceModel = mongoose.model("Device");
const authentication = require("../utils/authentication");
const config = require("../config");

function getLastSensorDataByDeviceId(deviceId) {
  return new Promise((resolve, reject) => {
    DeviceModel.aggregate([
      {
        $match: {
          _id: new require("mongoose").Types.ObjectId(
            deviceId
          )
        }
      },
      {
        $project: {
          sensorsData: {
            $slice: ["$sensorsData", -1]
          }
        }
      }
    ])
      .then(data => {
        console.log(data[0])
        resolve(data[0].sensorsData[0]);
      })
      .catch(err => {
        reject(err);
      });
  });
}

module.exports = {
  getAllUserDevices: function(req, res, next) {
    let userId = req.params.id;
    if (!authentication.isUserAdmin(req)) {
      userId = req.user._id;
    }
    if (userId) {
      userId = req.user._id;
    }

    let limit = Number(req.query.limit || 0);
    let page = Number(req.query.page || 1) - 1;

    const queryFieldsExclusion = {
      __v: false,
      deviceHistory: false
    };
    const expressionFind = {
      $or: [
        {
          deviceOwner: userId
        },
        {
          sharedWith: {
            $in: [userId]
          }
        }
      ]
    };

    DeviceModel.find(expressionFind, queryFieldsExclusion)
      .limit(limit)
      .skip(page * limit)
      .populate("deviceOwner sharedWith", ["username"])
      .select({ "sensorsData": { "$slice": -1 }})
      .exec(async function(err, data) {
        if (err) {
          res.status(500).json({
            msg: "Something went wrong while fetching devices"
          });
          return;
        }

        res.json({
          data: data,
          count: await DeviceModel.countDocuments(expressionFind),
          limit
        });
      });
  },
  createDevice: function(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        msg: "You are not authorized to perform this action"
      });
    }

    const body = req.body;

    DeviceModel.create({
      label: body.label,
      deviceOwner: req.user._id,
      token: body.token,
      sharedWith: body.sharedWith
    })
      .then(device => {
        return res.json({
          msg: "Device was created successfully",
          data: device
        });
      })
      .catch(err => {
        let error = "";
        if (err.message.includes("E11000")) {
          if (err.message.includes("token")) {
            error = "This token is already in use";
          } else if (err.message.includes("username")) {
            error = "This token is already in use";
          } else {
            error = "Duplicate Key Entry";
          }

          return res.status(409).json({
            error
          });
        }

        return res.status(409).json({
          msg: "Something went wrong with user creation",
          errror: err
        });
      });
  },
  editDevice: function(req, res, next) {
    if (!req.user) {
      return res.status(401).send({
        msg: "You are not authorized to perform this action"
      });
    }

    let deviceData = req.body;

    DeviceModel.findOne({
      _id: req.params.id
    }).exec(function(err, device) {
      if (err) {
        return res.status(400).json({
          msg: "Problem with getting device info"
        });
      }

      // if user doesn't own this device or user is not administrator - throws access error
      if (
        device.deviceOwner.toString() !== req.user._id.toString() &&
        !authentication.isUserAdmin(req)
      ) {
        return res.status(401).json({
          msg: "You are not authorized to perform this action"
        });
      }
console.log(deviceData.sharedWith)
      device.$set({
        label: deviceData.label,
        sharedWith: deviceData.sharedWith || [],
        token: deviceData.token
      });

      device.save(function(err, updatedRecord) {
        if (err) {
          let error = "";
          if (err.message.includes("E11000")) {
            if (err.message.includes("token")) {
              error = "This token is already in use";
            } else if (err.message.includes("username")) {
              error = "This token is already in use";
            } else {
              error = "Duplicate Key Entry";
            }

            return res.status(409).json({
              error
            });
          }

          return res.status(409).json({
            msg: "Something went wrong with user creation",
            errror: err
          });
        }

        return res.json({
          data: updatedRecord
        });
      });
    });
  },
  removeDevice: function(req, res, next) {
    if (!req.user) {
      return res.status(401).send({
        msg: "You are not authorized to perform this action"
      });
    }

    const deviceId = req.params.id;

    DeviceModel.findOne({
      _id: req.params.id
    }).exec(function(err, device) {
      if (err || !device) {
        return res.status(400).json({
          msg: "Problem with getting device info"
        });
      }

      // if user doesn't own this device or user is not administrator - throws access error
      if (
        device.deviceOwner.toString() !== req.user._id.toString() &&
        !authentication.isUserAdmin(req)
      ) {
        return res.status(401).json({
          msg: "You are not authorized to perform this action"
        });
      }

      device.remove(function(err, removedDevice) {
        if (err) {
          if (err) {
            return res.status(409).json({
              msg: "Something went wrong while removing device"
            });
          }
        }

        return res.json({
          data: removedDevice
        });
      });
    });
  },
  getDeviceStatus: function(req, res, next) {
    DeviceModel.findOne({
      token: req.params.token
    }).exec(function(err, device) {
      if (err) {
        return res.status(409).send("fail");
      }

      if (device) {
        return res.send("statrelay=" + Number(!!device.statusNow).toString());
      }

      return res.send("statrelay=" + "0");
    });
  },
  changeDeviceStatus: function(req, res, next) {
    // user doing this must be owner or he is within device shared users list
    if (!req.user) {
      return res.status(401).send({
        msg: "You are not authorized to perform this action"
      });
    }

    DeviceModel.findOne({
      token: req.params.token
    }).exec(function(err, device) {
      if (err) {
        return res.status(409).json({
          msg: "Something went wrong while getting device"
        });
      }

      if (device) {
        if (
          device.deviceOwner.toString() === req.user._id.toString() ||
          device.sharedWith.indexOf(req.user._id) > -1
        ) {
          const deviceStatus = Boolean(Number(req.body.status));

          const historyRecord = {
            userID: req.user._id.toString(),
            dateTurnOn: Date.now(),
            dateTurnOff: null
          };

          if (device.statusNow !== deviceStatus) {
            let lastItemIndex = device.deviceHistory.length - 1;
            if (lastItemIndex < 0) {
              device.deviceHistory.push(historyRecord);
            } else {
              if (device.deviceHistory[lastItemIndex].dateTurnOff === null) {
                device.deviceHistory[lastItemIndex].dateTurnOff = Date.now();
                device.deviceHistory[lastItemIndex].isNew = true;
              } else {
                device.deviceHistory.push(historyRecord);
              }
            }
          }

          device.$set({
            statusNow: deviceStatus
          });

          device.save(function(err, updatedRecord) {
            if (err) {
              return res.status(409).json({
                msg: "Something went wrong with user creation",
                errror: err
              });
            }

            return res.json({
              status: updatedRecord.statusNow
            });
          });
        }
      } else {
        return res.status(404).json({
          err: "Device not found"
        });
      }
    });
  },
  storeSensorData: function(req, res, next) {
    console.log(req.query);
    const token = req.params.token;
    const deviceData = req.query;

    DeviceModel.findOne({
      token: token
    }).exec(function(err, device) {
      if (err) {
        return res.status(409).send("fail");
      }

      if (device) {
        const sensorNewRecord = {
          date: Date.now(),
          temperature: deviceData.t,
          deviceStatus: device.statusNow,
          humidity: deviceData.h
        };
        console.log(device.t, device.h)

        getLastSensorDataByDeviceId(device._id).then(data => {
          let interval = 0;
          if (data)
            interval = data.date.getTime() + config.storeSensorDataInterval;

          if (Date.now() >= interval || !data) {
            device.sensorsData.push(sensorNewRecord);

            device.save(function(err, updatedRecord) {
              if (err) {
                return res.status(409).send("fail");
              }

              return res.status(200).send("ok");
            });
          } else {
            return res.status(200).send("wait");
          }
        });
      } else {
        return res.status(404).json({
          err: "Device not found"
        });
      }
    });
  },
  getDeviceById(req, res, next) {
    const deviceId = req.params.id;

    const yesterday = Date.now() - (24*3600*1000);

    // query date format [YYYY-MM-DD]
    const from = req.query.from ? new Date(req.query.from) : new Date(yesterday);
    const to = req.query.to ? new Date(req.query.to) : new Date(Date.now());

    if (to - from < 0) {
      return res.status(400).json({
        msg: "[From Date] must be before [To Date]"
      });
    }

    DeviceModel.aggregate([
      {
          $match: {
              "_id": mongoose.Types.ObjectId(deviceId),
          },
      },
      {
          $unwind: "$sensorsData"
      },
      {
          $match: {
            "sensorsData.date": {
              $gte: from, //new Date('2019-05-10T00:00:00'),
              $lte:  to //new Date('2019-05-19T03:00:00')
            }
          }
      },
      {
        $group: {
          _id: {
            _id : "$_id",
            statusNow: "$statusNow",
            sharedWith: "$sharedWith",
            label: "$label",
            deviceOwner: "$deviceOwner",
            token: "$token"
          },
          sensorsData : {'$push' : '$sensorsData'},
        }
      },
      {
          $project: {
              _id: "$_id._id",
              statusNow: "$_id.statusNow",
              sharedWith: "$_id.sharedWith",
              label: "$_id.label",
              deviceOwner: "$_id.deviceOwner",
              token: "$_id.token",
              sensorsData: 1
          },
      },
    ]).exec(function(err, device) {
        device = device.shift();
        if (err) {
          return res.status(409).json({
            msg: "Something went wrong while retrieving device data"
          });
        }

        const userId = req.user._id.toString();

        if (!device) {
          return res.status(404).json({
            msg: "Not found sensor data for the device"
          });
        }

        if (
          device.deviceOwner._id.toString() === userId ||
          device.sharedWith.map(user => user._id.toString()).indexOf(userId) >
            -1
        ) {
          return res.json({
            data: device
          });
        }

        return res.status(401).json({
          msg: "Access denied you are not authorized to get this device"
        });
      });
  },
  getDeviceInfo(req, res, next) {
    const deviceId = req.params.id;

    DeviceModel.aggregate([
      {
          $match: {
              "_id": mongoose.Types.ObjectId(deviceId),
          },
          
      },
      {
        $project: {
            _id: 1,
            label: 1,
            token: 1,
            deviceOwner: 1,
            sharedWith: 1,
            users: 1
        },
      },
      {
        $lookup: {
            from: "users", // collection name in db
            localField: "sharedWith",
            foreignField: "_id",
            as: "users"
        },
      }
    ]).exec(function(err, device) {
      if (err) {
        return res.status(409).json({
          msg: "Something went wrong while retrieving device info"
        });
      }
      
      return res.json({
        data: device.shift()
      });
    })
  },
  getDeviceHistory(req, res, next) {
    const deviceId = req.params.id;

    const yesterday = Date.now() - (24*3600*1000);

    // query date format [YYYY-MM-DD]
    const from = req.query.from ? new Date(req.query.from) : new Date(yesterday);
    const to = req.query.to ? new Date(req.query.to) : new Date(Date.now());

    if (to - from < 0) {
      return res.status(400).json({
        msg: "[From Date] must be before [To Date]"
      });
    }

    DeviceModel.aggregate([
      {
          $match: {
              "_id": mongoose.Types.ObjectId(deviceId),
          },
      },
      {
          $unwind: "$deviceHistory"
      },
      {
          $match: {
            "deviceHistory.dateTurnOn": {
              $gte: from, //new Date('2019-05-10T00:00:00'),
              $lte:  to //new Date('2019-05-19T03:00:00')
            }
          }
      },
      {
        $group: {
          _id: {
            _id : "$_id.id",
            deviceOwner: "$deviceOwner",
            sharedWith: "$sharedWith",
          },
          deviceHistory : {'$push' : '$deviceHistory'},
        }
      },
      {
          $project: {
              _id: "$_id._id",
              deviceOwner: "$_id.deviceOwner",
              sharedWith: "$_id.sharedWith",
              deviceHistory: 1
          },
      },
      {
        $lookup: {
            from: "users", // collection name in db
            localField: "deviceHistory.userID",
            foreignField: "_id",
            as: "users"

        }
      }
    ]).exec(function(err, device) {
      console.log(device)
        device = device.shift();
        if (err) {
          return res.status(409).json({
            msg: "Something went wrong while retrieving device data"
          });
        }

        const userId = req.user._id.toString();

        if (!device) {
          return res.status(404).json({
            msg: "No history found"
          });
        }

        device.deviceHistory.map(history => {
          let uid = device.users.findIndex(u => {
            return u._id.toString() == history.userID.toString()
          });
          return history.userID = device.users[uid].username;
        })

        delete device.users

        if (
          device.deviceOwner._id.toString() === userId ||
          device.sharedWith.map(user => user._id.toString()).indexOf(userId) >
            -1
        ) {
          return res.json({
            data: device
          });
        }

        return res.status(401).json({
          msg: "Access denied you are not authorized to get this device"
        });
      });
  }
};
