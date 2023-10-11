import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, StatusBar, Animated, Easing } from 'react-native';
import Theme from '../constants/Theme';

interface CustomHeaderProps {
  text: string;
}

const CustomHeaderLong: React.FC<CustomHeaderProps> = ({ text }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>{text}</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 313,
    borderBottomEndRadius: 45,
    borderBottomStartRadius: 45,
    flex: 0,
    backgroundColor: Theme.colors.primary,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 24,
  },
  text: {
    fontSize: 24,
    width: 317,
    fontFamily: 'Poppins-Medium',
    color: Theme.colors.lightGreen,
    textAlign: 'center',
  },
});

export default CustomHeaderLong;
