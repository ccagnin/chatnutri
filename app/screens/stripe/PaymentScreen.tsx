import React, { useState } from 'react';
import { View, Button, TextInput, Alert, Text, StyleSheet } from 'react-native';
import { CardField, StripeProvider, useStripe, CardForm, initStripe } from '@stripe/stripe-react-native';
import PlatformPayLocalButton from './PlatformPayLocalButton';
import { ApiStripe } from '../../api/ApiManager';

initStripe({
    publishableKey: 'sua_chave_publica_stripe',
});

function getPlans() {
    //ApiStripe.get()
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
    const [cardName, setCardName] = useState('');

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
                <CardForm
                    placeholders={{
                        number: 'Numero do cartão',
                    }}
                    defaultValues={{ countryCode: 'BR' }}
                    postalCodeEnabled={false}
                    style={{
                        width: '100%',
                        height: 200,
                    }}
                    onFormComplete={handleFormComplete}
                />
                <Button
                    title="Pagar"
                //onPress={handlePayment}
                />
            </View>
        </StripeProvider>
    );
}

export default PaymentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '5%',
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
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
})