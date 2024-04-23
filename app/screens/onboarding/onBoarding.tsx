import React, { useRef, useEffect, useState, } from 'react';
import { StyleSheet, View, Platform, Animated, Easing, Text } from 'react-native';
import Theme from '../../../constants/Theme';
import { CustomHeader } from '../../../components/CustomHeader';
import { useNavigation } from 'expo-router'
import AuthInput from '../../../components/AuthInput'
import { ApiManager } from '../../api/ApiManager';
import * as SecureStore from 'expo-secure-store';

const Onboarding = () => {
  const translateY = useRef(new Animated.Value(-200)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const url = 'https://pineapp-api-staging-staging.up.railway.app/';

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    console.log('Email a ser enviado:', email);
    try {
      const response = await ApiManager.post(url + 'users/checkEmail', {
        email,
      });
      console.log('Resposta da API:', response.data);

      const emailExists = response.data;
      console.log('Email existe?', emailExists);

      await SecureStore.setItemAsync('email', email);
      console.log('Email salvo no SecureStore:', email);

      const navigateToScreen = emailExists ? 'Auth' : 'SignUp';
      navigation.navigate(navigateToScreen, { email });

    } catch (error) {
      setError('Ocorreu um erro ao verificar o e-mail. Por favor, tente novamente.');
      console.log(error);
    }
  };

  const handleInputChange = (text: string) => {
    setEmail(text);
    setError(null);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1500,
        easing: Easing.bezier(0.5, 0, 0.25, 1),
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1500,
        easing: Easing.bezier(0.5, 0, 0.25, 1),
        delay: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
        <CustomHeader content={'123'} />
      </Animated.View>
      <Animated.View style={[styles.textContainer, { opacity: opacity }]}>
        <AuthInput
          text='Insira seu email'
          placeholder='nome@seuemail.com'
          buttonText='Entrar'
          onChangeText={handleInputChange}
          onPress={handleEmailSubmit}
        />
        {error && <Text style={{ color: 'red' }}>{error}</Text>}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    paddingHorizontal: 20,
    backgroundColor: Theme.colors.primary,
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default Onboarding;
