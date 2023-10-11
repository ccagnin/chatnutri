import React, { useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import Theme from '../constants/Theme';

const AuthInput = ({ text, placeholder, buttonText, onPress, onChangeText, secureTextEntry = false }) => {
  const translateY = useRef(new Animated.Value(-200)).current;
  const opacity = useRef(new Animated.Value(0)).current;

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
      <Text style={styles.text}>{text}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.emailBox}
          placeholder={placeholder}
          placeholderTextColor={'#646464'}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '700',
    color: Theme.colors.lightBrown,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-Bold',
  },
  inputContainer: {
    width: '80%', // Defina a largura desejada para o input
  },
  emailBox: {
    borderRadius: 45,
    backgroundColor: '#404040',
    borderStyle: 'solid',
    borderColor: '#047460',
    borderWidth: 1,
    height: 53,
    width: 304,
    padding: 10,
    paddingLeft: 20,
    fontFamily: 'Poppins-Regular',
    fontStyle: 'italic',
    color: '#646464',
  },
  buttonContainer: {
    borderRadius: 45,
    backgroundColor: '#047460',
    width: 304,
    height: 53,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: Theme.colors.lightGreen,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});

export default AuthInput;
