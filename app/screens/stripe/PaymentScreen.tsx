import React, { useEffect, useState } from 'react';
import { View, Button, TextInput, Alert, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { CardField, StripeProvider, initStripe, usePaymentSheet } from '@stripe/stripe-react-native';
import PlatformPayLocalButton from './PlatformPayLocalButton';
import { FontAwesome } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

// import {initPayment} from '../../utils/paymentsMethodsStripe'
// import {createSubscription} from '../../utils/subscriptionMethodsStripe'

initStripe({
    publishableKey: 'pk_test_51Or2CoJb0HiN0pQ4JmPUUk5Xa2MO4kCsMTT7UcodyNt8Nigd8SoB5IO1egCTWOrVUDk0VbygKybfbCtm38RUid4y00dPJP7Iio',
});

function PaymentScreen() {
    // payment
    const [ready, setReady] = useState(false);
    const [loadingPayment, setLoadingPayment] = useState(false);
    const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
    const [subscriptionId, setSubscriptionId] = useState(null);
    const route = useRoute();
    const { plan } = route.params as { plan: any };
    console.log('routeparams', route.params);
    console.log('selectedPlan', plan.title);

    useEffect(() => {
        initPayment()
        if (subscriptionId) {
            console.log('subscriptionId', subscriptionId);
        }
    }, []);

    const initPayment = async () => {
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
          // Exibição de alerta em caso de erro
          Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
          setReady(true); // Marca o pagamento como pronto
        }
        setLoadingPayment(false); // Marca o pagamento como carregado
      };

      const fetchPaymentSheetParams = async () => {
        try {
          const response = await fetch('http://192.168.15.4:4000/pay', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: await SecureStore.getItemAsync('name'),
              email: await SecureStore.getItemAsync('email'),
              price_id: plan.price_id,
            }),
          });

          console.log('response', response);

          if (!response.ok) {
            throw new Error('Erro ao buscar parâmetros do pagamento');
          }

          // Extração dos parâmetros da resposta da requisição
          const { setupIntent, ephemeralKey, customer, subscriptionId } = await response.json();
          setSubscriptionId(subscriptionId);
          console.log('subscriptionId', subscriptionId);

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

      // Função para criar a assinatura ao pressionar o botão "Subscribe"
      const createSubscription = async () => {
        const {error} = await presentPaymentSheet();
        if (error) {
          Alert.alert(`Error code: ${error.code}`, error.message);
        }
        // } else {
        //   try {
        //     await saveSubscription(subscriptionId);
        //     Alert.alert('Success', 'Payment successfully processed');
        //   } catch (error) {
        //     console.error('Erro ao salvar a assinatura:', error);
        //     Alert.alert('Error', 'Failed to save subscription');
        //   }
        // }
      };

      // Função para salvar a assinatura no servidor backend e associar o subscriptionId ao ID do usuário
    //   const saveSubscription = async (subscriptionId: string) => {
    //     try {
    //       const response = await fetch('http://rota.com/save-subscription', { //Essa rota é a da API principal, não da API de pagamentos
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

    return (
        <StripeProvider
          publishableKey="pk_test_51Or2CoJb0HiN0pQ4JmPUUk5Xa2MO4kCsMTT7UcodyNt8Nigd8SoB5IO1egCTWOrVUDk0VbygKybfbCtm38RUid4y00dPJP7Iio"
        >
          <View style={styles.container}>
            <View>
              <Text style={styles.labelPayment}>Plano selecionado: {plan ? plan.title : 'Carregando...'}</Text>
            </View>
            <View style={{ height: 400 }}>
              <View><Text style={styles.labelPayment}>Pagar com cartão de crédito</Text></View>
              <CardField
                cardStyle={{
                  backgroundColor: '#FFFFFF',
                  textColor: '#000000',
                }}
                style={styles.containerCreditCardPayment}
                postalCodeEnabled={false}
              />
            <Button
                title="Pagar"
                onPress={async () => {
                    // Verifique se o pagamento está pronto antes de apresentar a folha de pagamento
                    if (!loadingPayment && ready) {
                    await createSubscription();
                    }
                }}
            />
            </View>
          </View>
        </StripeProvider>
      );
}

function Content() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={{ flex: 1 }}>
                    <PaymentScreen />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Content;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: '2%',
        paddingVertical: '5%',
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
    },
    labelPayment: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: '2%',
    },
    googlePayContainer: {
        marginBottom: '5%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerCreditCardPayment: {
        width: '100%',
        height: 50,
        marginVertical: 30,
    },
    plansContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    cardContainer: {
        paddingHorizontal: 10,
        height: 100,
        width: '30%',
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        marginBottom: '5%',
        borderColor: 'black',
        borderWidth: .5,
        borderRadius: 14,
    },
    selectedCard: {
        paddingHorizontal: 10,
        width: '30%',
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        marginBottom: '5%',
        borderWidth: .5,
        borderRadius: 14,
        opacity: 0.5,
    },
    planText: {
        fontSize: 14,
    },
    valuePlanText: {
        fontSize: 16,
        fontWeight: "bold",
    }
})
