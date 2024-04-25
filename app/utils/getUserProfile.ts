import axios from 'axios';
import { getToken } from '../context/storeToken'

const url = 'https://pineapp-api-staging-staging.up.railway.app/';

export const getUserProfile = async () => {
  try {
    const token = await getToken();

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(url + 'users/profile', config);

    console.log('User:', response.data);
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
}
