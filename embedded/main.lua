local conn = ""
local conn1 = ""
local request = ""
local request1 = ""
local stat = ""
local tmp = ""

local host=s.server
local port=s.port
local token=s.token

--communication with Arduino
uart.on("data", "\r", function (data)
    local tempereture, humidity = data:match("([^,]+)|([^,]+)")
    --remove \r form humidity string
    if (humidity ~= nil) then
        tmp = string.gsub(humidity, "\r", "")
    end
    humidity = tmp
    if (tempereture ~= "" and humidity ~= "") then
        sendData(tempereture, humidity, token)
        --print ("Tempereture: "..tempereture.." Humidity: "..humidity)
    end

    tempereture = ""
    humidity = ""
end, 0)

--send relay status to arduino
tmr.alarm(1, 1000, 1, function ()
    getRelayStatus ()
    tmr.delay(900)
end)

function sendData (temp, hum, tk)
    conn = net.createConnection(net.TCP, 0)
    request="GET /api/resource/device/sensor/store/"..token.."/?h="..hum.."&t="..temp.." HTTP/1.1\r\nHost: "..host..":"..port.."\r\nCache-Control: no-cache\r\n\r\n"
    conn:on("connection", function (sck, c) sck:send(request) end)
    conn:on("receive", function (c, pl) tmr.delay(500) c:close() end)
    conn:connect(port, host)
end

function getRelayStatus ()
    conn1 = net.createConnection(net.TCP, 0)
    request1 = "GET /api/resource/device/status/"..token.." HTTP/1.1\r\nHost: "..host..":"..port.."\r\nConnection: keep-alive\r\nAccept: */*\r\n\r\n"
    conn1:on("connection", function (sck, c) sck:send(request1) end)
    conn1:on("receive", function(c, pl) 
        stat = pl:match("[^statrelay=]+$")..'\n\r'
        tmr.delay(500) 
        uart.write(0, stat) 
        c:close() 
    end)
    conn1:connect(port, host)
end