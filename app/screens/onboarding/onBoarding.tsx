import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, Platform } from 'react-native';

const OnBoarding = () => {
  return (
      <View style={styles.container}>
        <Text>Your Content Here</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#785',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OnBoarding;
