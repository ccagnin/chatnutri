import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Theme from '../../../constants/Theme'

const Payments = ({ route, navigation }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const name = (route.params as { name?: string }).name;
  const email = (route.params as { email?: string }).email;
  const password = (route.params as { password?: string }).password;
  const selectedPlan = (route.params as { selectedPlan?: any }).selectedPlan;

  const handlePayment = () => {
    // add lógica de pagamento aqui
    navigation.navigate('PaymentConfirmation', { screen: 'PaymentConfirmation', name, email, password });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.planText}>Plano Selecionado:</Text>
      <Text style={styles.planName}>{selectedPlan?.title}</Text>
      <Text style={styles.planValue}>{selectedPlan?.value}</Text>

      <Text style={styles.paymentText}>Informações de Pagamento:</Text>
      <TextInput
        style={styles.input}
        placeholder="Número do Cartão"
        value={cardNumber}
        placeholderTextColor={'#646464'}
        onChangeText={(text) => setCardNumber(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Vencimento (MM/YY)"
        placeholderTextColor={'#646464'}
        value={expirationDate}
        onChangeText={(text) => setExpirationDate(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="CVV"
        value={cvv}
        placeholderTextColor={'#646464'}
        onChangeText={(text) => setCvv(text)}
      />

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pagar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: Theme.colors.background,
  },
  planText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Theme.colors.lightBrown,
    fontFamily: 'Poppins-Medium'
  },
  planName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Theme.colors.lightBrown,
    marginBottom: 8,
  },
  planValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Theme.colors.primary,
    marginBottom: 16,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Poppins-Medium',
    color: Theme.colors.lightBrown,
  },
  input: {
    height: 40,
    borderRadius: 45,
    borderColor: '#047460',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 20,
    color: '#646464',
    backgroundColor: '#404040',
    fontFamily: 'Poppins-Regular',
  },
  payButton: {
    backgroundColor: Theme.colors.primary,
    padding: 12,
    borderRadius: 45,
    alignItems: 'center',
  },
  payButtonText: {
    color: Theme.colors.lightGreen,
    fontSize: 18,
    fontFamily: 'Poppins-Regular'
  },
});

export default Payments;
