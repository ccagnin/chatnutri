import { ApiManager } from '../api/ApiManager'


export const saveSubscription = async (subscriptionId: string, userId: number, token: string) => {
  try {
      console.log('Salvando assinatura no banco de dados', subscriptionId, userId, token);
      const response = await ApiManager.post('/save-subscription', //Essa rota é a da API principal, não da API de pagamentos
      {
          subscriptionId,
          userId: userId,
      },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Resposta da API:', response);

      if (response.status !== 201) {
          throw new Error('Erro ao salvar inscrição no banco de dados', response.data);
      }

      console.log('Assinatura salva com sucesso!', response.data);

      return response.data;

  } catch (error) {
      console.error('Erro ao salvar a assinatura no banco de dados:', error);
      throw error;
  }
};
