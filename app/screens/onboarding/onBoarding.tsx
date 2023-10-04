import React, { useRef, useEffect, useState, } from 'react';
import { StyleSheet, View, Platform, Animated, Easing } from 'react-native';
import Theme from '../../../constants/Theme';
import { CustomHeader } from '../../../components/CustomHeader';
import { useNavigation } from 'expo-router'
import AuthInput from '../../../components/AuthInput'
import { ApiManager } from '../../api/ApiManager';

const Onboarding = () => {
  const translateY = useRef(new Animated.Value(-200)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleEmailSubmit = async () => {
    console.log('Email a ser enviado:', email);
    try {
      const response = await ApiManager.post('users/checkEmail', {
        email,
      });

      const emailExists = response.data.emailExists;

      if (emailExists) {
        navigation.navigate('Auth', { screen: 'Auth', email });
      } else {
        navigation.navigate('SignUp', { screen: 'SignUp', email });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (text: string) => {
    setEmail(text);
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
          text='Insira seu email'
          placeholder='nome@seuemail.com'
          buttonText='Entrar'
          onChangeText={handleInputChange}
          onPress={handleEmailSubmit}
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

export default Onboarding;
