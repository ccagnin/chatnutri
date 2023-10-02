import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthProps {
  authState: { token: string | null; authenticated: boolean | null };
  onRegister: (email: string, password: string) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<any>;
}

const TOKEN_KEY = 'jwt';
export const API_URL = 'http://localhost:3333';
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
      return await axios.post(`${API_URL}/auth/signup`, { email, password });
    } catch (error) {
      return { error: true, message: (error as any).response?.data?.message };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
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

  const value = {
    authState,
    onRegister: register,
    onLogin: login,
    onLogout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
