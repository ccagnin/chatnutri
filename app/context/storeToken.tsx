import AsyncStorage from '@react-native-async-storage/async-storage';

const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (error) {
    console.error('Erro ao armazenar o token:', error);
  }
};

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (error) {
    console.error('Erro ao obter o token:', error);
  }
};

const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.error('Erro ao remover o token:', error);
  }
};

export { storeToken, getToken, removeToken };
