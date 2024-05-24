import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { initStripe, usePaymentSheet } from '@stripe/stripe-react-native';

interface Plan {
  priceId: string;
}

interface User {
  name: string;
  email: string;
}

export const usePayment = (user: User) => {
  const [ready, setReady] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      await initStripe({
        publishableKey: 'pk_test_51Or2CoJb0HiN0pQ4JmPUUk5Xa2MO4kCsMTT7UcodyNt8Nigd8SoB5IO1egCTWOrVUDk0VbygKybfbCtm38RUid4y00dPJP7Iio',
      });
    };
    initializeStripe();
  }, []);

  const fetchPaymentSheetParams = async (plan: Plan) => {
    const body = {
      name: user.name,
      email: user.email,
      price_id: plan.priceId,
    };

    try {
      const response = await fetch('http://192.168.15.2:4000/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log('Enviando requisição para https://stripe-subscriptions-staging.up.railway.app/pay com os seguintes dados:', body);

      if (!response.ok) {
        throw new Error('Erro ao buscar parâmetros do pagamento');
      }

      const { setupIntent, ephemeralKey, customer, subscriptionId } = await response.json();
      setSubscriptionId(subscriptionId);

      return {
        setupIntent,
        ephemeralKey,
        customer,
      };
    } catch (error) {
      console.error('Erro ao buscar parâmetros do pagamento:', error);
      throw error;
    }
  };

  const initPayment = useCallback(async (plan: Plan) => {
    if (!plan) return;

    setLoadingPayment(true);
    try {
      const { setupIntent, ephemeralKey, customer } = await fetchPaymentSheetParams(plan);
      const { error } = await initPaymentSheet({
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
    } catch (error) {
      console.error('Erro ao inicializar a folha de pagamento:', error);
      Alert.alert('Erro ao inicializar a folha de pagamento');
    } finally {
      setLoadingPayment(false);
    }
  }, [user]);

  const createSubscription = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    }
  };

  return { ready, loadingPayment, createSubscription, initPayment, subscriptionId };
};
