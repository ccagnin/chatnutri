import { usePaymentSheet } from "@stripe/stripe-react-native";
import { useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';

export const usePayment = (plan, userId, name, email) => {
  const [ready, setReady] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const {initPaymentSheet, presentPaymentSheet} = usePaymentSheet();
  const [subscriptionId, setSubscriptionId] = useState(null);

  useEffect(() => {
    const initPayment = async () => {
      if (!plan) {
        return;
      }

      setLoadingPayment(true);
      const {setupIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();
      const {error} = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        setupIntentClientSecret: setupIntent,
        merchantDisplayName: 'Pine App',
        allowsDelayedPaymentMethods: true,
        returnURL: 'example://stripe-redirect',
      });
      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        setReady(true);
      }
      setLoadingPayment(false);
    };

    initPayment();
  }, [plan]);

  const fetchPaymentSheetParams = async () => {
    const body = {
        name: await SecureStore.getItemAsync('name'),
        email: await SecureStore.getItemAsync('email'),
        price_id: plan.price_id,
        };

    try {
      const response = await fetch('http://192.168.15.4:4000/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        });
      console.log('Enviando requisição para http://192.168.15.4:4000/pay com os seguintes dados:', body);

      if (!response.ok) {
        throw new Error('Erro ao buscar parâmetros do pagamento');
      }

      const { setupIntent, ephemeralKey, customer, subscriptionId } = await response.json();
      setSubscriptionId(subscriptionId);

      return {
        setupIntent,
        ephemeralKey,
        customer,
        subscriptionId,
      };
    } catch (error) {
      console.error('Erro ao buscar parâmetros do pagamento:', error);
      throw error;
    }
  }

  const createSubscription = async () => {
    const {error} = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    }
  };


  return { ready, loadingPayment, createSubscription };
}

// const createSubscription = async () => {
//     const {error} = await presentPaymentSheet();
//     if (error) {
//       Alert.alert(`Error code: ${error.code}`, error.message);
//     }
    // } else {
    //   try {
    //     await saveSubscription(subscriptionId);
    //     Alert.alert('Success', 'Payment successfully processed');
    //   } catch (error) {
    //     console.error('Erro ao salvar a assinatura:', error);
    //     Alert.alert('Error', 'Failed to save subscription');
    //   }
    // }
//   };

//   const saveSubscription = async (subscriptionId) => {
//     try {
//       const response = await fetch('http://rota.com/save-subscription', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           subscriptionId,
//           userId: userId,
//         }),
//       });
//       if (!response.ok) {
//         throw new Error('Erro ao salvar a assinatura no banco de dados');
//       }
//     } catch (error) {
//       console.error('Erro ao salvar a assinatura no banco de dados:', error);
//       throw error;
//     }
//   };
