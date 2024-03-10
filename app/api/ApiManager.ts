import axios from 'axios';

export const ApiManager = axios.create({
  baseURL: 'http://192.168.0.5:3333/',
  responseType: 'json',
  withCredentials: true,
});
