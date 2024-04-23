import React from 'react';
import { View, Alert } from 'react-native';
import { PlatformPayButton, usePlatformPay, PlatformPay } from '@stripe/stripe-react-native';
import { ApiManager } from '../../api/ApiManager';

function PaymentScreen() {
    const {
        isPlatformPaySupported,
        confirmPlatformPayPayment,
    } = usePlatformPay();

    //   React.useEffect(() => {

    //   }, []);

    const fetchPaymentIntentClientSecret = async () => {
        // Fetch payment intent created on the server, see above
        const response = await ApiManager.post(`/create-payment-intent`, {
            data: JSON.stringify({
                currency: 'usd',
            }),
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const { clientSecret } = await response.data;

        return clientSecret;
    };

    const pay = async () => {
        const clientSecret = await fetchPaymentIntentClientSecret();

        const { error } = await confirmPlatformPayPayment(
            clientSecret,
            {
                googlePay: {
                    testEnv: true,
                    merchantName: 'My merchant name',
                    merchantCountryCode: 'US',
                    currencyCode: 'USD',
                    billingAddressConfig: {
                        format: PlatformPay.BillingAddressFormat.Full,
                        isPhoneNumberRequired: true,
                        isRequired: true,
                    },
                },
            }
        );

        if (error) {
            Alert.alert(error.code, error.message);
            return;
        }
        Alert.alert('Success', 'The payment was confirmed successfully.');
    };

    return (
        <View >
            <PlatformPayButton
                type={PlatformPay.ButtonType.Pay}
                onPress={pay}
                style={{
                    width: '100%',
                    height: 50,
                }}
            />
        </View>
    );
}

export default PaymentScreen;