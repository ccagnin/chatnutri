import { StyleSheet, View, StatusBar } from 'react-native';
import React from 'react';

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
