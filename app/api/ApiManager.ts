import axios from 'axios';

export const ApiManager = axios.create({
  baseURL: 'http://192.168.15.2:3333/',
  responseType: 'json',
  withCredentials: true,
});

export const ApiStripe = axios.create({
  baseURL: 'http://192.168.15.2:4000/',
  responseType: 'json',
  withCredentials: true,
});
