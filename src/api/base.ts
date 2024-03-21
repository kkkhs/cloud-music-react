import axios from 'axios';

const instance = axios.create({
  withCredentials: true,
  baseURL: '/api',
  timeout: 10000,
});

export default instance;
