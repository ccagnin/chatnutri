import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { CustomHeader } from '../components/CustomHeader'


export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayoutNav() {

  return (
    <Stack>
      <Stack.Screen name="index" options={{ header: () => null }} />
    </Stack>
  );
}
