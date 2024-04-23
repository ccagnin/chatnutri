import JWT from 'expo-jwt';

const isTokenValid = (token) => {
    try {
        const decodedToken = JWT.decode(token, 'secret');
        const dataAtual = Math.floor(Date.now() / 1000);
        if (decodedToken.exp <= dataAtual) {
            return { valid: false, message: 'Token expirado' };
        }

        return { valid: true, message: 'Token válido', email: decodedToken.email };
    } catch (error) {
        return { valid: false, message: 'Token inválido', error: error };
    }
};

export default isTokenValid;