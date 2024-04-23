import { Alert } from 'react-native';
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
export const createSubscription = async (subscriptionId, presentPaymentSheet) => {
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