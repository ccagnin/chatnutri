import React, { useEffect, useState } from 'react';
import { View, Button, TextInput, Alert, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { CardField, StripeProvider, useStripe, CardForm, initStripe, usePaymentSheet } from '@stripe/stripe-react-native';
import PlatformPayLocalButton from './PlatformPayLocalButton';
import { ApiStripe } from '../../api/ApiManager';
import { FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

initStripe({
    publishableKey: 'sua_chave_publica_stripe',
});


function CardSelectPlan({ props, isSelected, handlePlanSelected }) {

    return (
        <TouchableOpacity style={isSelected == props.id ? styles.selectedCard : styles.cardContainer} onPress={() => handlePlanSelected(props.id)}>
            {isSelected == props.id && <FontAwesome name="check-circle" size={24} color="green" style={{
                position: 'absolute',
                right: 5,
                top: 5,
            }} />}
            <Text style={styles.planText}>{props.name}</Text>
            <Text style={styles.valuePlanText}>{props.value.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            })}</Text>
        </TouchableOpacity>
    );
}

function PaymentScreen() {
    // payment
    const [ready, setReady] = useState(false);
    const [loadingPayment, setLoadingPayment] = useState(false);
    const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
    const [subscriptionId, setSubscriptionId] = useState(null);

    // payment functions

    // Função para obter os parâmetros do pagamento do servidor backend
    const fetchPaymentSheetParams = async () => {
        try {
            const name = await SecureStore.getItemAsync('name');
            const email = await SecureStore.getItemAsync('email');
            const response = await fetch('http://192.168.15.2:4000/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Corpo da requisição com os parâmetros do usuário
                body: JSON.stringify({
                    name,
                    email,
                    selectedPlan,
                }),
            });

            console.log('response', response);

            if (!response.ok) {
                throw new Error('Erro ao buscar parâmetros do pagamento');
            }

            // Extração dos parâmetros da resposta da requisição
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

    // Função para inicializar o pagamento
    const initPayment = async () => {
        setLoadingPayment(true);
        // Obtenção dos parâmetros do pagamento do servidor backend
        const { setupIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();
        // Inicialização da sessão de pagamento com o Stripe
        const { error } = await initPaymentSheet({
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

    useEffect(() => {
        initPayment()
    }, []);
    // end payment functions

    // subscription
    // Função para salvar a assinatura no servidor backend e associar o subscriptionId ao ID do usuário
    const saveSubscription = async (subscriptionId) => {
        try {
            const userId = await SecureStore.getItemAsync('userId');
            const response = await fetch('http://rota.com/save-subscription', { //Essa rota é a da API principal, não da API de pagamentos
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscriptionId,
                    userId: userId,
                }),
            });
            if (!response.ok) {
                throw new Error('Erro ao salvar a assinatura no banco de dados');
            }
        } catch (error) {
            console.error('Erro ao salvar a assinatura no banco de dados:', error);
            throw error;
        }
    };

    // Função para criar a assinatura ao pressionar o botão "Subscribe"
    const createSubscription = async () => {
        const { error } = await presentPaymentSheet();
        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            try {
                await saveSubscription(subscriptionId);
                Alert.alert('Success', 'Payment successfully processed');
            } catch (error) {
                console.error('Erro ao salvar a assinatura:', error);
                Alert.alert('Error', 'Failed to save subscription');
            }
        }
    };

    // end subscription

    // end payment

    // plans
    const [plans, setPlans] = useState([
        { id: 'price_1Or2MeJb0HiN0pQ4j8pwoBzv', name: 'Plano semanal', value: 5 },
        { id: 'price_1Or2MeJb0HiN0pQ4rYTyZuZm', name: 'Plano mensal', value: 20 },
        { id: 'price_1Or2MeJb0HiN0pQ4j8pwoBzv', name: 'Plano anual', value: 240 },
    ])

    const [selectedPlan, setSelectedPlan] = useState(null)
    const handlePlanSelected = (plan_id) => {
        if (plan_id === selectedPlan) {
            setSelectedPlan(null)
            return
        }
        setSelectedPlan(plan_id)
    }
    // end plans

    return (
        <StripeProvider
            publishableKey="pk_test_XKUpwPvvEnNxMsSzoLm8H3i8"
        >
            <View style={styles.container}>
                <View>
                    <Text style={styles.labelPayment}>Selecione o plano</Text>
                    <View style={styles.plansContainer}>
                        <CardSelectPlan props={plans[0]} isSelected={selectedPlan} handlePlanSelected={handlePlanSelected} />
                        <CardSelectPlan props={plans[1]} isSelected={selectedPlan} handlePlanSelected={handlePlanSelected} />
                        <CardSelectPlan props={plans[2]} isSelected={selectedPlan} handlePlanSelected={handlePlanSelected} />
                    </View>

                </View>
                <View style={{ height: 400 }}>
                    {/* <View style={styles.googlePayContainer}>
                    <View><Text style={styles.labelPayment}>Pagar com Google pay</Text></View>
                    <PlatformPayLocalButton />
                </View> */}
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
                        onPress={createSubscription}
                        disabled={!ready}
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