import { ApiStripe } from '../api/ApiManager';

// Função para obter os parâmetros do pagamento do servidor backend
const fetchPaymentSheetParams = async ({setSubscriptionId, selectedPlan, name, email}) => {
    try {
        const response = await ApiStripe.post('/pay', {
            name,
            email,
            price_id:selectedPlan
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('response', response.data);

        // Extração dos parâmetros da resposta da requisição
        const { setupIntent, ephemeralKey, customer, subscriptionId } = response.data;
        setSubscriptionId(subscriptionId);

        return {
            setupIntent,
            ephemeralKey,
            customer,
            subscriptionId,
        };
    } catch (error) {
        console.error('Erro ao buscar parâmetros do pagamento:', error.response.data);
        throw error;
    }
}

// Função para inicializar o pagamento
export const initPayment = async ({initPaymentSheet, setSubscriptionId, setLoadingPayment, selectedPlan, setReady, name, email}) => {
    setLoadingPayment(true);
    // Obtenção dos parâmetros do pagamento do servidor backend
    const { setupIntent, ephemeralKey, customer } = await fetchPaymentSheetParams({setSubscriptionId, selectedPlan, name, email});
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

