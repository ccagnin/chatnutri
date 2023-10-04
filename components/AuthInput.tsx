import React, { useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Animated, Easing } from 'react-native';
import Theme from '../constants/Theme'

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
      <TextInput
        style={[styles.emailBox, {color: Theme.colors.lightBrown}]}
        placeholder={placeholder}
        placeholderTextColor={Theme.colors.lightBrown}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      <View style={styles.buttonContainer}>
        <Button title={buttonText} onPress={onPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '38%',
  },
  text: {
    fontSize: 24,
    fontWeight: '700',
    color: Theme.colors.lightBrown,
    textAlign: 'center',
    marginBottom: 20,
  },
  emailBox: {
    borderRadius: 45,
    backgroundColor: '#404040',
    borderStyle: 'solid',
    borderColor: '#047460',
    borderWidth: 1,
    height: 53,
    padding: 10,
    paddingLeft: 20,
    width: 304,
    marginBottom: 20,
  },
  buttonContainer: {
    borderRadius: 45,
    backgroundColor: '#047460',
    width: 304,
    height: 53,
    marginBottom: 20,
    justifyContent: 'center',
    color: Theme.colors.lightBrown,
  },
  button: {
    flex: 1,
  },
});

export default AuthInput;
