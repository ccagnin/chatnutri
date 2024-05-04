import * as SecureStore from 'expo-secure-store';
import isTokenValid from './isTokenValid';

const checkAuth = async ({navigation, route = null}) => {
    const token = await SecureStore.getItemAsync('token');
    const isValid = isTokenValid(token);
    if (isValid.valid) {
      await SecureStore.setItemAsync('email', isValid.email);
      if(route){
          navigation.navigate(route.name, route.body);
      }
    } else {
      navigation.navigate('Onboarding', { screen: 'Onboarding' });
    }
  }

export default checkAuth;