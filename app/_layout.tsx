import React from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from './screens/onboarding/onBoarding';
import Page from './index';
import { useAuth } from './context/AuthContext';


import Auth from './screens/auth/Auth'
import SignUp from './screens/auth/SignUp'
import EnterPassword from './screens/auth/EnterPassword'
import ObjectivesScreen from './screens/onboarding/MeasuresChat'
import WeightInput from './screens/onboarding/WeightInput'
import HeightInput from './screens/onboarding/HeightInput'
import AgeInput from './screens/onboarding/AgeInput'

import Plans from './screens/onboarding/Plans'
import Payments from './screens/onboarding/Payments'
import PaymentConfirmation from './screens/onboarding/PaymentConfirmation'

// after auth
import HomeRecepes from './screens/recipes/HomeRecepes'
import EditProfile from './screens/profile/EditProfile'
import WeekDay from './screens/recipes/WeekDay'

// payment methods
import PaymentScreen from './screens/stripe/PaymentScreen'

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

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: fadeAnimation,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 1000 } },
            close: { animation: 'timing', config: { duration: 1000 } },
          },
        }}
      >
        <Stack.Screen name="index" component={Page} />
        {authState.authenticated ? (
          <Stack.Screen name='HomeRecepes' component={HomeRecepes} />
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Auth" component={Auth} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="EnterPassword" component={EnterPassword} />
            <Stack.Screen name="Plans" component={Plans} />
            <Stack.Screen name="Payments" component={Payments} />
            <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmation} />
            <Stack.Screen name="MeasuresChat" component={ObjectivesScreen} />
            <Stack.Screen name="WeightInput" component={WeightInput} />
            <Stack.Screen name="HeightInput" component={HeightInput} />
            <Stack.Screen name="AgeInput" component={AgeInput} />
            <Stack.Screen name="HomeRecepes" component={HomeRecepes} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="WeekDay" component={WeekDay} />
            <Stack.Screen options={{headerShown: true, title: 'Planos e pagamento'}} name="PaymentScreen" component={PaymentScreen} />
          </>

        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootLayoutNav;
