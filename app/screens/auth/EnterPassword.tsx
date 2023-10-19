import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Animated, Easing, Platform } from 'react-native';
import CustomHeaderLong from '../../../components/CustomHeaderLong';
import AuthInput from '../../../components/AuthInput';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ApiManager } from '../../api/ApiManager';
import Theme from '../../../constants/Theme';

const EnterPassword = () => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [password, setPassword] = useState('');
  const route = useRoute();
  const email = (route.params as { email?: string }).email;
  const name  = (route.params as { name?: string }).name;

  const navigation = useNavigation();

  const handleInputChange = (text: string) => {
    setPassword(text);
  };

  const createUser = async () => {
    try {
      const response = await ApiManager.post('auth/signup', {
        email,
        name,
        password: password,
      });

      console.log('Resposta da API:', response.data);

      if (response.data.access_token) {
        navigation.navigate('Plans', { screen: 'Plans', name, email, password });
      } else {
        console.log('Erro ao logar');
      }
    } catch (error) {
      console.log('Erro:', error);
      alert('Erro ao criar usuário');
    }
  }

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
        <CustomHeaderLong text={`Vimos que você ainda não tem cadastro. Bora criar?`} />
      </Animated.View>
      <Animated.View style={[styles.textContainer, { opacity: opacity }]}>
        <AuthInput
          text='Escolha sua senha'
          placeholder='************'
          buttonText='Próximo'
          onChangeText={handleInputChange}
          onPress={createUser}
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

export default EnterPassword;
