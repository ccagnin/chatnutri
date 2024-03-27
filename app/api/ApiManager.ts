import axios from 'axios';

export const ApiManager = axios.create({
  baseURL: 'http://192.168.0.7:3333/',
  responseType: 'json',
  withCredentials: true,
});

export const ApiStripe = axios.create({
  baseURL: 'http://192.168.0.7:4000/',
  responseType: 'json',
  withCredentials: true,
});