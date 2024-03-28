import { StyleSheet, View, Text, StatusBar, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import Theme from '../constants/Theme';

export const CustomHeader = ({ content }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        {content && content}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 132,
    borderBottomEndRadius: 45,
    borderBottomStartRadius: 45,
    flex: 0,
    backgroundColor: Theme.colors.primary,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    
  } as any,
  content:{
    flex: 1,
    justifyContent: 'flex-end',
  }
});
