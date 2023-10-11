import React from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Onboarding from './screens/onboarding/Onboarding';
import Page from './index';
import { useAuth } from './context/AuthContext';
import HomeRecepes from './screens/recipes/HomeRecepes'
import Auth from './screens/auth/Auth'
import { ApiManager } from './api/ApiManager'
import SignUp from './screens/auth/SignUp'
import EnterPassword from './screens/auth/EnterPassword'
import ObjectivesScreen from './screens/onboarding/MeasuresChat'
import WeightInput from './screens/onboarding/WeightInput'
import HeightInput from './screens/onboarding/HeightInput'
import AgeInput from './screens/onboarding/AgeInput'

export const unstable_settings = {
  initialRouteName: 'index',
};

const Stack = createStackNavigator();

const RootLayoutNav = () => {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-ExtraLight': require('../assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
    'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-Italic': require('../assets/fonts/Poppins-Italic.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const fadeAnimation = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  const { authState, onLogout } = useAuth();

  const emailExists = async (email: string) => {
    try {
      const response = await ApiManager.post('users/checkEmail', {
        email,
      });
      console.log('Resposta da API no layout:', response.data);

      const emailExists = response.data.emailExists;
      console.log('Email existe?', emailExists);

      return emailExists;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: fadeAnimation,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 1000 } }, // Ajuste a duração conforme necessário
            close: { animation: 'timing', config: { duration: 1000 } },
          },
        }}
      >
        <Stack.Screen name="index" component={Page} />
        { authState.authenticated ? (
          <Stack.Screen name='HomeRecepes' component={HomeRecepes} />
        ) : (
          <><><><><Stack.Screen name="Onboarding" component={Onboarding} />
              <Stack.Screen name="Auth" component={Auth} />
              <Stack.Screen name="SignUp" component={SignUp} />
              <Stack.Screen name="EnterPassword" component={EnterPassword} /></>
              <Stack.Screen name="MeasuresChat" component={ObjectivesScreen} />
              <Stack.Screen name="WeightInput" component={WeightInput} />
              <Stack.Screen name="HeightInput" component={HeightInput} />
              <Stack.Screen name="AgeInput" component={AgeInput} /></>
            </><Stack.Screen name="HomeRecepes" component={HomeRecepes} /></>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootLayoutNav;
