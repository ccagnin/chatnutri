import { Alert } from 'react-native';
import { ApiManager } from './ApiManager';

// Função para salvar a assinatura no servidor backend e associar o subscriptionId ao ID do usuário
const saveSubscription = async (subscriptionId) => {
    try {
        const userId = await SecureStore.getItemAsync('userId');
        const response = await ApiManager.post('/save-subscription', //Essa rota é a da API principal, não da API de pagamentos
        {
            subscriptionId,
            userId: userId,
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        if (response.status < 200 && response.status >= 300) {
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