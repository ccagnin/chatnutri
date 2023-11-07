import axios from 'axios';

export const ApiManager = axios.create({
  baseURL: 'http://192.168.1.2:3000/',
  responseType: 'json',
  withCredentials: true,
});
