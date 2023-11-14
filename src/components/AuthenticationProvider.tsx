import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useRouter } from 'next/router';

import { ChildrenFC } from '../utils/types';

export const TOKEN_KEY = 'token';

export type AuthenticationContextValueType = {
  login: (newToken: string) => void;
  logout: () => void;
};

const AuthenticationContext = createContext<AuthenticationContextValueType>(
  null as any as AuthenticationContextValueType,
);

export const AuthenticationProvider: ChildrenFC = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      router.push('/prihlaseni');
    }
  }, []);

  const login = useCallback((newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const value = useMemo(() => ({ login, logout }), [login, logout]);

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => useContext(AuthenticationContext);
