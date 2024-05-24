import { Alert } from 'react-native';
import { ApiManager } from '../api/ApiManager';

// Função para salvar a assinatura no servidor backend e associar o subscriptionId ao ID do usuário

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
