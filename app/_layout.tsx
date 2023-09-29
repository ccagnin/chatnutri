import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Onboarding from './screens/onboarding/Onboarding';
import Page from './index';

export const unstable_settings = {
  initialRouteName: 'index',
};

const Stack = createStackNavigator();

const RootLayoutNav = () => {
  // const [fontsLoaded] = useFonts({
  //   'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
  //   'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
  //   'Montserrat-Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
  //   'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
  //   'Montserrat-Light': require('../assets/fonts/Montserrat-Light.ttf'),
  //   'Montserrat-ExtraBold': require('../assets/fonts/Montserrat-ExtraBold.ttf'),
  //   'Montserrat-Black': require('../assets/fonts/Montserrat-Black.ttf'),
  // });

  // if (!fontsLoaded) {
  //   return null;
  // }

  const fadeAnimation = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

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
        <Stack.Screen name="Onboarding" component={Onboarding} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootLayoutNav;
