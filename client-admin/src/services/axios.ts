import { message } from 'antd';
import axios, { AxiosError } from 'axios';

const service = axios.create({
  baseURL: `${import.meta.env.VITE_BASEURL}/admin`,
});

service.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers!.authorization = token;
  }
  return config;
});

service.interceptors.response.use(undefined, (error: AxiosError) => {
  const { response } = error;
  message.error(
    response?.status === 500
      ? '服务器错误'
      : `${response?.status}: ${response?.data.message}`,
  );
  return Promise.reject(error);
});

export default service;
