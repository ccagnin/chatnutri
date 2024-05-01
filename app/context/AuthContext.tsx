import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { ApiManager } from '../api/ApiManager';

import JWT from 'expo-jwt';

interface AuthProps {
  authState: { token: string | null; authenticated: boolean | null };
  onRegister: (email: string, password: string) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<any>;
}

const TOKEN_KEY = 'token';
const AuthContext = createContext<AuthProps>({
  authState: { token: null, authenticated: null },
  onRegister: async () => {},
  onLogin: async () => {},
  onLogout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{ token: string | null; authenticated: boolean | null }>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        console.log('stored:', token);

        if (token) {
          setAuthState({ token, authenticated: true });
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          setAuthState({ token: null, authenticated: false });
        }
      } catch (error) {
        console.log(error);
      }
    }

    loadToken();
  }
  , []);


  const register = async (email: string, password: string) => {
    try {
      return await ApiManager.post(`/auth/signup`, { email, password });
    } catch (error) {
      return { error: true, message: (error as any).response?.data?.message };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await ApiManager.post(`/auth/login`, { email, password });
      console.log(response);

      setAuthState({ token: response.data.token, authenticated: true });

      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
      return response;
    } catch (error) {
      return { error: true, message: (error as any).response?.data?.message };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    axios.defaults.headers.common['Authorization'] = '';

    setAuthState({ token: null, authenticated: false });
  };

  const isTokenValid = (token: string) => {
    try {
      const decodedToken = JWT.decode(token, 'secret');
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decodedToken.exp <= currentTimestamp) {
        return { valid: false, message: 'Token expirado' };
      }

      return { valid: true, message: 'Token válido', email: decodedToken.email };
    } catch (error) {
      return { valid: false, message: 'Token inválido', error };
    }
  };

  const checkTokenValidity = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        const validity = isTokenValid(token);
        if (!validity.valid) {
          // Token inválido, faça o que for necessário (como logout)
          await logout();
        }
      }
    } catch (error) {
      console.error('Erro ao verificar a validade do token:', error);
    }
  };

  useEffect(() => {
    checkTokenValidity();
  }, []);

  const value = {
    authState,
    onRegister: register,
    onLogin: login,
    onLogout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
