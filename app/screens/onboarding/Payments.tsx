import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Theme from '../../../constants/Theme';
import { mask, unMask } from 'react-native-mask-text';
import { ApiManager } from '../../api/ApiManager';

const Payments = ({ route, navigation }) => {
  const email = (route.params as { email?: string }).email;
  const password = (route.params as { password?: string }).password;
  const name = (route.params as { name?: string }).name;
  const selectedPlan = (route.params as { selectedPlan?: any }).selectedPlan;

  const [paymentData, setPaymentData] = useState({
    card_number: '',
    expiration_date: '',
    security_code: '',
    identificationNumber: '',
    identificationType: "CPF",
    name: '',
    amount: selectedPlan.price,
    frequencyType: selectedPlan.frequency_type,
    frequency: selectedPlan.frequency,
    planId: selectedPlan.planId,
  });

  const getToken = async () => {
    try {
      const response = await ApiManager.post('auth/login', {
        email,
        password,
      });

      if (response.data && response.data.token) {
        console.log('token', response.data.token);
        return response.data.token;
      } else {
        console.error('Erro ao logar', response.data);
        throw new Error('Erro ao logar');
      }
    } catch (error) {
      console.error('Erro ao obter o token:', error);
      throw error;
    }
  };

  const fetchUser = async () => {
    try {
      const token = await getToken();

      const response = await ApiManager.get('users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = response.data;
      return user;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    try {
      const token = await getToken();
      console.log('token', token);
      const user = await fetchUser();
      console.log('user', user);

      if (
        paymentData.name !== '' &&
        paymentData.identificationNumber !== '' &&
        paymentData.identificationType !== '' &&
        paymentData.card_number !== '' &&
        paymentData.security_code !== '' &&
        paymentData.expiration_date !== ''
      ) {
        const paymentDataWithUserId = {
          ...paymentData,
          userId: user.id,
          email: user.email,
          security_code: parseInt(paymentData.security_code),
        };

        console.log('paymentDataWithUserId', paymentDataWithUserId);

        const response = await ApiManager.post('users/payment/create', paymentDataWithUserId, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const res = response.data;

        if (res.error === false) {
          alert(res.message);
          if (res.status === 200) {
            navigation.navigate('PaymentConfirmation', { screen: 'PaymentConfirmation', name, email, password });
          }
        } else {
          alert(res.message);
        }
      } else {
        if (paymentData.name == '' || paymentData.identificationNumber == '' || paymentData.identificationType == '') {
          alert('Informe os dados do titular do cartão.');
        }

        if (paymentData.card_number == '' && paymentData.security_code == '' && paymentData.expiration_date == '') {
          alert('Informe os dados do cartão.');
        }
      }
    } catch (error: any) {
      if (error.response) {
        // Se a exceção tiver uma resposta da API
        console.error('Resposta da API:', error.response.data);
        console.error('Status de resposta da API:', error.response.status);
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Verifique os dados e tente novamente.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.planText}>Plano Selecionado:</Text>
      <Text style={styles.planName}>{selectedPlan?.title}</Text>
      <Text style={styles.planValue}>{selectedPlan?.value}</Text>

      <Text style={styles.paymentText}>Informações de Pagamento:</Text>
      <TextInput
        placeholder="Nome do Titular do Cartão"
        placeholderTextColor="#646464"
        value={paymentData.name}
        onChangeText={(text) => setPaymentData({ ...paymentData, name: text })}
        style={{ width: '100%' }}
      />
      <TextInput
        placeholder="Número do Cartão"
        placeholderTextColor={'#646464'}
        keyboardType='numeric'
        value={mask(paymentData.card_number, '9999 9999 9999 9999')}
        onChangeText={async text => {
          setPaymentData({ ...paymentData, card_number: unMask(text) })
        }}
        style={{ width: '100%' }}
      />
      <TextInput
        placeholder="Data de Vencimento (MM/YY)"
        placeholderTextColor={'#646464'}
        keyboardType='numeric'
        value={mask(paymentData.expiration_date, '99/99')}
        onChangeText={async text => {
          setPaymentData({ ...paymentData, expiration_date: unMask(text) })
        }}
        style={{ width: '70%' }}
      />
      <TextInput
        placeholder="CVV"
        placeholderTextColor={'#646464'}
        keyboardType='numeric'
        value={mask(paymentData.security_code, '9999')}
        onChangeText={async text => {
          setPaymentData({ ...paymentData, security_code: text })
        }}
        style={{ width: '30%' }}
      />
      <TextInput
        placeholder="CPF do titular do cartão"
        placeholderTextColor={'#646464'}
        keyboardType='numeric'
        value={mask(paymentData.identificationNumber, '999.999.999-99')}
        onChangeText={async text => {
          setPaymentData({ ...paymentData, identificationNumber: unMask(text) })
        }}
        style={{ width: '100%' }}
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
