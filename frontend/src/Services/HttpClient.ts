import axios, { CanceledError } from "axios";

const httpClient = axios.create({
  baseURL: import.meta.env.BASE_URL,
});

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers["authorization"] = `JWT ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { CanceledError };

export default apiClient;