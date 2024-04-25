import axios from 'axios';
import { getToken } from '../context/storeToken'

const url = 'https://pineapp-api-staging-staging.up.railway.app/';

export const updateUserSubscription = async () => {
  try {
    const token = await getToken();

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(url + 'users/profile', config);
    const user = response.data;
    console.log('User:', user);
    const updateResponse = await axios.patch(url + 'users/profile/edit', { isSubscribed: true }, config);

    console.log('User updated:', updateResponse.data);
    return updateResponse.data;
  } catch (error) {
    console.log('Error:', error);
  }
}
