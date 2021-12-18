import axios from 'axios';
import store from '@/store';
import { getToken } from '@/utils/auth';

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000,
  headers: {
    'Content-type': 'application/json;charset=UTF-8'
  }
});

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken();
    }
    if (store.getters.language) {
      config.headers['Accept-Language'] = store.getters.language;
    }
    return config;
  },
  error => {
    console.log('service.interceptors.request-' + error);
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  function(response) { return response; },
  function(error) {
    // handle error
    if (error) {
      console.log('service.interceptors.response-' + error);
    }
  });

export default service;
