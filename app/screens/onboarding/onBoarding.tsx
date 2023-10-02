import React, { useRef, useEffect, useState, } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Platform, Animated, Easing, Button } from 'react-native';
import Theme from '../../../constants/Theme';
import { CustomHeader } from '../../../components/CustomHeader';
import { TextInput } from 'react-native-gesture-handler'
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'
import { useNavigation } from 'expo-router'

const Onboarding = () => {
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
        <Text style={styles.text}>Insira seu email</Text>
        <TextInput
          style={[styles.emailBox, styles.frameLayout]}
          placeholder='nome@email.com'
          placeholderTextColor='#646464'
          onChangeText={(text) => setEmail(text)}
        />
       <View style={styles.buttonContainer}>
          <Button
            title="Enviar"
            onPress={() => {
              login();
            }}
          />
        </View>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: "700",
    color: Theme.colors.lightBrown,
    textAlign: "center",
    height: 107,
    top: 0,
  },
  textContainer: {
    top: 368,
    height: 300,
    width: 304,
    overflow: "hidden",
    alignSelf: "center",
    position: "absolute",
  },
  emailBox: {
    top: 54,
    borderRadius: 45,
    backgroundColor: "#404040",
    borderStyle: "solid",
    borderColor: "#047460",
    borderWidth: 1,
    height: 53,
    padding: 10,
    paddingLeft: 20,
  },
  frameLayout: {
    width: 304,
    position: 'absolute',
    color: Theme.colors.lightBrown,
  },
  buttonContainer: {
    top: 100,
    width: 304,
    height: 53,
    borderRadius: 45,
    backgroundColor: "#047460",
    alignSelf: "center",
    position: "absolute",
  },
});

export default Onboarding;
