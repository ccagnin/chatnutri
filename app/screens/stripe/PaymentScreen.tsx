import React, { useEffect, useState } from 'react';
import { View, Button, TextInput, Alert, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { CardField, StripeProvider, useStripe, CardForm, initStripe } from '@stripe/stripe-react-native';
import PlatformPayLocalButton from './PlatformPayLocalButton';
import { ApiStripe } from '../../api/ApiManager';
import { FontAwesome } from '@expo/vector-icons';

initStripe({
    publishableKey: 'sua_chave_publica_stripe',
});

function getPlans() {
    //ApiStripe.get()
}


function CardSelectPlan({ props, isSelected, handlePlanSelected }) {

    return (
        <TouchableOpacity style={isSelected == props.id ? styles.selectedCard : styles.cardContainer} onPress={() => handlePlanSelected(props.id)}>
            {isSelected == props.id && <FontAwesome name="check-circle" size={24} color="green" style={{
                position:'absolute',
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
    const { confirmPayment } = useStripe();
    const [form, setForm] = useState({
        cardName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvc: '',
    });
    const [cardDetails, setCardDetails] = useState({});
    const [cardName, setCardName] = useState();

    const [selectedLanguage, setSelectedLanguage] = useState();

    const [plans, setPlans] = useState([
        { id: 1, name: 'Plano semanal', value: 5 },
        { id: 2, name: 'Plano mensal', value: 20 },
        { id: 3, name: 'Plano anual', value: 240 },
    ])

    const [plansList, setPlansList] = useState([]);

    const [selectedPlan, setSelectedPlan] = useState(null)

    const handlePlanSelected = (plan_id) => {
        if (plan_id === selectedPlan) {
            setSelectedPlan(null)
            return
        }
        setSelectedPlan(plan_id)
    }


    const handleFormComplete = async () => {
        try {
            const { paymentIntent, error } = await confirmPayment('CLIENT_SECRET_HERE', {
                paymentMethodType: 'Card',
                paymentMethodData: {
                    billingDetails: {
                        address: {
                            country: 'BR',
                        },
                    },
                },
            });

            if (error) {
                Alert.alert('Erro', error.message);
            } else if (paymentIntent) {
                Alert.alert('Sucesso', 'Pagamento bem-sucedido!');
            }
        } catch (error) {
            console.error('Erro ao processar o pagamento:', error);
        }
    };

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
                <TextInput
                    style={styles.input}
                    placeholder="Nome no cartão"
                    onChangeText={(val) => setForm({ ...form, cardName: val })}
                    value={cardName}
                />
                <CardField
                    cardStyle={{
                        backgroundColor: '#FFFFFF',
                        textColor: '#000000',
                    }}
                    style={styles.containerCreditCardPayment}
                    onCardChange={(cardDetails) => {
                        console.log('cardDetails', cardDetails);
                    }}
                    postalCodeEnabled={false}
                />
                <Button
                    title="Pagar"
                //onPress={handlePayment}
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
    plansContainer:{
        flex: 1,
        flexDirection: 'row',
    },
    cardContainer: {
        paddingHorizontal:10,
        height: 100,
        width: '30%',
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        marginBottom: '5%',
        borderColor:'black',
        borderWidth:.5,
        borderRadius: 14,
    },
    selectedCard: {
        paddingHorizontal:10,
        width: '30%',
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        marginBottom: '5%',
        borderWidth:.5,
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