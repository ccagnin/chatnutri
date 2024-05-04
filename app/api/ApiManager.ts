import axios from 'axios';

export const ApiManager = axios.create({
  baseURL: 'http://192.168.0.2:3333/',
  responseType: 'json',
  withCredentials: true,
});

export const ApiStripe = axios.create({
  baseURL: 'https://stripe-subscriptions-staging.up.railway.app',
  responseType: 'json',
  withCredentials: true,
});