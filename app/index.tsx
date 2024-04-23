import React, { useEffect } from 'react';
import { StyleSheet, View, StatusBar, Image } from 'react-native';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import logo from '../assets/images/ChatNutri_logo.png';
import { useNavigation } from '@react-navigation/native';
import Theme from '../constants/Theme'
import { useAuth } from './context/AuthContext';
import { isSubscribed } from './utils/isSubscribed';

import * as SecureStore from 'expo-secure-store';
import isTokenValid from './utils/isTokenValid';


const Page = () => {
  const animationIn = FadeInUp.springify()
    .damping(30)
    .mass(5)
    .stiffness(10)
    .restDisplacementThreshold(0.1)
    .restSpeedThreshold(5);

  const animationOut = FadeOut.springify();

  const navigation = useNavigation();
  const { authState } = useAuth();

  const checkAuth = async () => {
    await SecureStore.deleteItemAsync('token'); // Limpa o token do SecureStore
    const token = await SecureStore.getItemAsync('token');
    console.log('Token:', token); // Imprime o valor do token
    const isValid = isTokenValid(token);
    if (isValid.valid) {
      await SecureStore.setItemAsync('email', isValid.email);
      console.log('autenticado')
      const subscribed = await isSubscribed(isValid.email); // Verifica se o usuário está inscrito
      if (subscribed) {
        navigation.navigate('HomeRecepes', { screen: 'HomeRecepes' });
      } else {
        navigation.navigate('Plans', { screen: 'Plans' }); // Navega para a tela de planos se o usuário não estiver inscrito
      }
    } else {
      navigation.navigate('Onboarding', { screen: 'Onboarding' });
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      checkAuth()
    }, 5000)
  }, [])

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     if (authState.authenticated) {
  //       console.log('autenticado')
  //       navigation.navigate('HomeRecepes', { screen: 'HomeRecepes' });
  //     } else {
  //       console.log('nao autenticado')
  //       navigation.navigate('Onboarding', { screen: 'Onboarding' });
  //     }
  //   }, 5000);

  //   return () => clearTimeout(timeout);
  // }, [authState.authenticated, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View entering={animationIn} exiting={animationOut}>
        <Image style={styles.logo} source={logo} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 164,
    height: 189,
  },
});

export default Page;
