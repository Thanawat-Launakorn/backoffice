import axios from "axios";

const getToken = () => localStorage.getItem("id_token");

const instance = axios.create();

instance.interceptors.request.use(
  (request) => {
    const token = getToken();
    request.baseURL = `${process.env.ENDPOINT}`;
    request.headers["Accept"] = `application/json`;
    request.headers["id_token"] = token;
    request.validateStatus = (_) => true;
    return Promise.resolve(request);
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
