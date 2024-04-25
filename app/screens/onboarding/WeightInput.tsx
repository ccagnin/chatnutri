import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Platform, Animated, Easing } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomHeaderLong from '../../../components/CustomHeaderLong';
import AuthInput from '../../../components/AuthInput';
import Theme from '../../../constants/Theme';
import * as SecureStore from 'expo-secure-store';

const WeightInput = () => {
  const [weight, setWeight] = useState('');
  const [showAuthInput, setShowAuthInput] = useState(false);
  const navigation = useNavigation();
  const translateY = useRef(new Animated.Value(0)).current;
  const authInputOpacity = useRef(new Animated.Value(0)).current;
  const route = useRoute();

  const name = (route.params as { name?: string }).name;
  const objective = (route.params as { objective?: number }).objective;

  const handleNext = () => {
    navigation.navigate('HeightInput', {
      name,
      objective,
      weight: parseInt(weight),
    });
  };

  const handleWeightChange = (text: string) => {
    setWeight(text);
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
              text='Digite o seu peso em kg'
              placeholder='Ex: 70'
              buttonText='Próximo'
              onChangeText={handleWeightChange}
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

export default WeightInput;
