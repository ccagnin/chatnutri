import * as SecureStore from 'expo-secure-store';

// Função para obter os parâmetros do pagamento do servidor backend
const fetchPaymentSheetParams = async ({setSubscriptionId, selectedPlan}) => {
    try {
        const name = await SecureStore.getItemAsync('name');
        const email = await SecureStore.getItemAsync('email');
        const body = JSON.stringify({
            name,
            email,
            selectedPlan,
        })
        const response = await fetch('http://192.168.0.5:4000/pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Corpo da requisição com os parâmetros do usuário
            body,
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
export const initPayment = async ({initPaymentSheet, setSubscriptionId, setLoadingPayment, selectedPlan, setReady}) => {
    setLoadingPayment(true);
    // Obtenção dos parâmetros do pagamento do servidor backend
    const { setupIntent, ephemeralKey, customer } = await fetchPaymentSheetParams({setSubscriptionId, selectedPlan});
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

