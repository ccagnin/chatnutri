import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const PaymentConfirmation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const name = (route.params as { name?: string }).name;
  const email = (route.params as { email?: string }).email;
  const password = (route.params as { password?: string }).password;

  const handleContinue = () => {
    navigation.navigate('MeasuresChat', { screen: 'MeasuresChat', name, email, password });
  };

  return (
    <View style={styles.container}>
      <Text>PaymentConfirmation</Text>
      <Button title="Vamos lá!" onPress={handleContinue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PaymentConfirmation;
