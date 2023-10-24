import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Platform, Animated, Easing } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomHeaderLong from '../../../components/CustomHeaderLong';
import AuthInput from '../../../components/AuthInput';
import Theme from '../../../constants/Theme';
import { ApiManager } from '../../api/ApiManager';

const AgeInput = () => {
  const [age, setAge] = useState('');
  const [showAuthInput, setShowAuthInput] = useState(false);
  const navigation = useNavigation();
  const translateY = useRef(new Animated.Value(0)).current;
  const authInputOpacity = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const route = useRoute();
  const name = (route.params as { name?: string }).name;
  const objective = (route.params as { objective?: number }).objective;
  const weight = (route.params as { weight?: number }).weight;
  const height = (route.params as { height?: number }).height;
  const email = (route.params as { email?: string }).email;
  const password = (route.params as { password?: string }).password;

  console.log (name, objective, weight, height, email, password);

  const getToken = async () => {
    try {
      const response = await ApiManager.post('auth/login', {
        email,
        password,
      });

      if (response.data && response.data.token) {
        return response.data.token;
      } else {
        console.log('Erro ao logar');
      }
    } catch (error) {
      console.error('Error fetching token:', error);
      throw error;
    }
  };

  const fetchUser = async () => {
    try {
      const token = await getToken();

      const response = await ApiManager.get('users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = response.data;
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  const handleNext = async () => {
    try {
      const ageNumber = parseInt(age);
      const token = await getToken();

      const user = await fetchUser();

      const response = await ApiManager.post(
        'users/measures/create',
        {
          initWeight: weight,
          height,
          age: ageNumber,
          objective,
          userId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        navigation.navigate('HomeRecepes', { screen: 'HomeRecepes', name, token, user });
      } else {
        console.log('Erro ao criar medidas:', response.data);
      }
    } catch (error) {
      console.log('Erro:', error);
      alert('Erro ao criar medidas');
    }
  };

  const handleAgeChange = (text: string) => {
    setAge(text);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setShowAuthInput(true);
      Animated.timing(authInputOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

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
        <CustomHeaderLong text={`Bem vindo, ${name}!`} />
      </Animated.View>
      <View style={styles.textContainer}>
        {showAuthInput && (
          <Animated.View style={[styles.authInputContainer, { opacity: authInputOpacity }]}>
            <AuthInput
              text='Agora digite sua idade'
              placeholder='Ex: 25'
              buttonText='Tudo pronto!'
              onChangeText={handleAgeChange}
              onPress={handleNext}
              secureTextEntry={false}
            />
          </Animated.View>
        )}
      </View>
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
  authInputContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default AgeInput;
