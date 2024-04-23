import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

const url = 'https://pineapp-api-staging-staging.up.railway.app/'

export const isSubscribed = async () => {
  try {
    const email = await SecureStore.getItemAsync('email');
    const response = await axios.get(url + 'users/checkUserByEmail', {
      params: {
        user: email,
      },
    });
    console.log('IsSubscribed:', response.data.isSubscribed);
    return response.data.isSubscribed;
  } catch (error) {
    console.log('Error:', error);
  }
}
