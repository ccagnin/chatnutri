import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Animated, Easing, Platform } from 'react-native';
import CustomHeaderLong from '../../../components/CustomHeaderLong';
import AuthInput from '../../../components/AuthInput';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ApiManager } from '../../api/ApiManager';
import Theme from '../../../constants/Theme'

const Auth = () => {
  const translateY = useRef(new Animated.Value(-181)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const route = useRoute();
  const email = (route.params as { email?: string }).email;

  const navigation = useNavigation();

  const login = async () => {
    try {
      const response = await ApiManager.post('auth/login', {
        email,
        password,
      });

      if (response.data.token) {
        navigation.navigate('HomeRecepes', { screen: 'HomeRecepes' });
      } else {
        console.log('Erro ao logar');
      }
    } catch (error) {
      console.log('Erro:', error);
    }
  };

  const handleInputChange = (text: string) => {
    setPassword(text);
  };

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await ApiManager.get(`users/getUserByEmail?email=${email}`);
        if (response.data) {
          setUserName(response.data.name);
        }
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchUserName();
  }, [email]);

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
        <CustomHeaderLong text={`Bem vindo de volta, ${userName}`} />
      </Animated.View>
      <Animated.View style={[styles.textContainer, { opacity: opacity }]}>
        <AuthInput
          text='Digite sua senha'
          placeholder='***********'
          buttonText='Entrar'
          onChangeText={handleInputChange}
          onPress={login}
          secureTextEntry={true}
        />
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
    backgroundColor: Theme.colors.background,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Auth;
