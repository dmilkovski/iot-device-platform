import axios from "axios";
let address = '192.168.8.104:3030' //'10.104.195.100'
// let address = '10.104.195.100'
const axiosInstance = axios.create({
  baseURL: `/api/`,
  timeout: 5000,
  headers: {
    Origin: '*'//`http://${address}:3030/`
    // Origin: `http://${address}:3030/`
  }
});

// add inteceptor for axios token
axiosInstance.interceptors.request.use(
  function(config) {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.token = token;
    }

    return config;
  },
  function(err) {
    return Promise.reject(err);
  }
);

export default axiosInstance;
