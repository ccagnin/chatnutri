import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, StatusBar, Animated, Easing } from 'react-native';
import Theme from '../constants/Theme';

const TextHeader = ({text}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);
    
    return <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>{text && text}</Animated.Text>
}


const styles = StyleSheet.create({
    text: {
      fontSize: 24,
      width: 317,
      fontFamily: 'Poppins-Medium',
      color: Theme.colors.lightGreen,
      textAlign: 'center',
    },
  });

export default TextHeader