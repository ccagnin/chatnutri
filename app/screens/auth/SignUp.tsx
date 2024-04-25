import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Animated, Easing, Platform } from 'react-native';
import CustomHeaderLong from '../../../components/CustomHeaderLong';
import AuthInput from '../../../components/AuthInput';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ApiManager } from '../../api/ApiManager';
import Theme from '../../../constants/Theme';
import * as SecureStore from 'expo-secure-store';

const SignUp = () => {
  const translateY = useRef(new Animated.Value(-181)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [name, setName] = useState('');
  const route = useRoute();
  const email = (route.params as { email?: string }).email;

  const navigation = useNavigation();

  const handleInputChange = async (text: string) => {
    setName(text);
    await SecureStore.setItemAsync('name', text);
  };

  const navigateToNextScreen = () => {
    if (email && name) {
      navigation.navigate('EnterPassword', {
        email,
        name,
      });
    } else {
      // Handle the case where email or name is missing
      console.log('Email or name is missing.');
    }
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
        <CustomHeaderLong text={`Vimos que você ainda não tem cadastro. Bora criar?`} />
      </Animated.View>
      <Animated.View style={[styles.textContainer, { opacity: opacity }]}>
        <AuthInput
          text='Como você gostaria de ser chamadoo?'
          placeholder='Nome'
          buttonText='Próximo'
          onChangeText={handleInputChange}
          onPress={navigateToNextScreen}
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

export default SignUp;
