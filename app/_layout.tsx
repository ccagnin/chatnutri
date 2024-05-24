import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from './screens/onboarding/onBoarding';
import Page from './index';
import Auth from './screens/auth/Auth';
import SignUp from './screens/auth/SignUp';
import EnterPassword from './screens/auth/EnterPassword';
import ObjectivesScreen from './screens/onboarding/MeasuresChat';
import WeightInput from './screens/onboarding/WeightInput';
import HeightInput from './screens/onboarding/HeightInput';
import AgeInput from './screens/onboarding/AgeInput';
import Plans from './screens/onboarding/Plans';
import Payments from './screens/onboarding/Payments';
import PaymentConfirmation from './screens/onboarding/PaymentConfirmation';
import HomeRecepes from './screens/recipes/HomeRecepes';
import EditProfile from './screens/profile/EditProfile';
import WeekDay from './screens/recipes/WeekDay';
import PaymentScreen from './screens/stripe/PaymentScreen';

const Stack = createStackNavigator();

const ROUTES = {
  INDEX: 'Index',
  ONBOARDING: 'Onboarding',
  AUTH: 'Auth',
  SIGNUP: 'SignUp',
  ENTER_PASSWORD: 'EnterPassword',
  PLANS: 'Plans',
  PAYMENTS: 'Payments',
  PAYMENT_CONFIRMATION: 'PaymentConfirmation',
  MEASURES_CHAT: 'MeasuresChat',
  WEIGHT_INPUT: 'WeightInput',
  HEIGHT_INPUT: 'HeightInput',
  AGE_INPUT: 'AgeInput',
  HOME_RECIPES: 'HomeRecepes',
  EDIT_PROFILE: 'EditProfile',
  WEEK_DAY: 'WeekDay',
  PAYMENT_SCREEN: 'PaymentScreen'
};

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
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const fadeAnimation = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName={ROUTES.INDEX}
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: fadeAnimation,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 1000 } },
            close: { animation: 'timing', config: { duration: 1000 } },
          },
        }}
      >
        <Stack.Screen name={ROUTES.INDEX} component={Page} />
        <Stack.Screen name={ROUTES.ONBOARDING} component={Onboarding} />
        <Stack.Screen name={ROUTES.AUTH} component={Auth} />
        <Stack.Screen name={ROUTES.SIGNUP} component={SignUp} />
        <Stack.Screen name={ROUTES.ENTER_PASSWORD} component={EnterPassword} />
        <Stack.Screen name={ROUTES.PLANS} component={Plans} />
        <Stack.Screen name={ROUTES.PAYMENTS} component={Payments} />
        <Stack.Screen name={ROUTES.PAYMENT_CONFIRMATION} component={PaymentConfirmation} />
        <Stack.Screen name={ROUTES.MEASURES_CHAT} component={ObjectivesScreen} />
        <Stack.Screen name={ROUTES.WEIGHT_INPUT} component={WeightInput} />
        <Stack.Screen name={ROUTES.HEIGHT_INPUT} component={HeightInput} />
        <Stack.Screen name={ROUTES.AGE_INPUT} component={AgeInput} />
        <Stack.Screen name={ROUTES.HOME_RECIPES} component={HomeRecepes} />
        <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfile} />
        <Stack.Screen name={ROUTES.WEEK_DAY} component={WeekDay} />
        <Stack.Screen name={ROUTES.PAYMENT_SCREEN} component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootLayoutNav;
