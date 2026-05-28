import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginResponse } from '../types/auth';
import { axiosInstance } from '../api/axiosConfig';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/me');
        const { username, role } = response.data;
        setUser({ username, role });
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, []);

  const login = async (username: string, password: string): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post<LoginResponse>('/api/auth/login', {
        username,
        password,
      });

      const { username: loggedUser, role } = response.data;
      const newUser: User = { username: loggedUser, role };
      setUser(newUser);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Usuario o contraseña incorrectos');
      }
      throw new Error('Ocurrió un error inesperado al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (error) {
      console.error('Error durante el logout en el servidor', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
