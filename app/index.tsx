import React, { useEffect } from 'react';
import { StyleSheet, View, StatusBar, Image } from 'react-native';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import logo from '../assets/images/ChatNutri_logo.png';
import { useNavigation } from '@react-navigation/native';
import Onboarding from './screens/onboarding/Onboarding';
import Theme from '../constants/Theme'

const Page = () => {
  const animationIn = FadeInUp.springify()
    .damping(30)
    .mass(5)
    .stiffness(10)
    .restDisplacementThreshold(0.1)
    .restSpeedThreshold(5);

  const animationOut = FadeOut.springify();

  const navigation = useNavigation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('Onboarding', { screen: 'Onboarding' });
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View entering={animationIn} exiting={animationOut}>
        <Image style={styles.logo} source={logo} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 164,
    height: 189,
  },
});

export default Page;
