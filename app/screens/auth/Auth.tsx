import React, { useRef, useEffect, useState, } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Platform, Animated, Easing, Button } from 'react-native';
import Theme from '../../../constants/Theme';
import { CustomHeader } from '../../../components/CustomHeader';
import { TextInput } from 'react-native-gesture-handler'
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'
import { useNavigation } from 'expo-router'
import AuthInput from '../../../components/AuthInput'

const Auth = () => {
  const translateY = useRef(new Animated.Value(-200)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [email, setEmail] = useState('');
  const { onLogin, onRegister } = useAuth();

  const navigation = useNavigation();

  const login = async () => {
    navigation.navigate('Auth', { email, screen: 'Auth' });
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
        <CustomHeader />
      </Animated.View>
      <Animated.View style={[styles.textContainer, { opacity: opacity }]}>
        <AuthInput
          text='Digite sua senha'
          placeholder='***********'
          buttonText='Entrar'
          onPress={login}
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
    backgroundColor: Theme.colors.primary,
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default Auth;
