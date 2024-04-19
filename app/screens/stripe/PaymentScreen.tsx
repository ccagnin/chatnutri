import React, { useEffect, useState } from 'react';
import { View, Button, TextInput, Alert, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { CardField, StripeProvider, initStripe, usePaymentSheet } from '@stripe/stripe-react-native';
import PlatformPayLocalButton from './PlatformPayLocalButton';
import { FontAwesome } from '@expo/vector-icons';

import {initPayment} from '../../utils/paymentsMethodsStripe'
import {createSubscription} from '../../utils/subscriptionMethodsStripe'

initStripe({
    publishableKey: 'sua_chave_publica_stripe',
});


function CardSelectPlan({ props, isSelected, handlePlanSelected }: any) {
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
    const [plans, setPlans] = useState<{ id: string; name: string; value: number }[]>([]);

    const [selectedPlan, setSelectedPlan] = useState(null)
    const handlePlanSelected = (plan_id: any) => {
        if (plan_id === selectedPlan) {
            setSelectedPlan(null)
            return
        }
        setSelectedPlan(plan_id)
    }
    // end plans

    useEffect(() => {
        setPlans([
            { id: 'price_1Or2MeJb0HiN0pQ4TbG4eMiT', name: 'Plano semanal', value: 5 },
            { id: 'price_1Or2MeJb0HiN0pQ4rYTyZuZm', name: 'Plano mensal', value: 20 },
            { id: 'price_1Or2MeJb0HiN0pQ4j8pwoBzv', name: 'Plano anual', value: 240 }
        ]);
        initPayment({initPaymentSheet, setSubscriptionId, setLoadingPayment, selectedPlan, setReady})
    }, []);

    return (
        <StripeProvider
            publishableKey="pk_test_XKUpwPvvEnNxMsSzoLm8H3i8"
        >
            <View style={styles.container}>
                <View>
                    <Text style={styles.labelPayment}>Selecione o plano</Text>
                    {plans.length !== 0 &&
                        <View style={styles.plansContainer}>
                            <CardSelectPlan props={plans[0]} isSelected={selectedPlan} handlePlanSelected={handlePlanSelected} />
                            <CardSelectPlan props={plans[1]} isSelected={selectedPlan} handlePlanSelected={handlePlanSelected} />
                            <CardSelectPlan props={plans[2]} isSelected={selectedPlan} handlePlanSelected={handlePlanSelected} />
                        </View>
                    }
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
                        onPress={() => createSubscription(subscriptionId, presentPaymentSheet)}
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