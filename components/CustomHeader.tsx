import { StyleSheet, View, Text, StatusBar, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import Theme from '../constants/Theme';

export const CustomHeader = ({ content }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        {typeof content === 'string' ? <Text>{content}</Text> : content}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 132,
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomStartRadius: 45,
    borderBottomEndRadius: 45,
  },
  content:{
    flex: 1,
    justifyContent: 'flex-end',
  }
});
