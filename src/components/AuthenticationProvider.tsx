import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/router';

import { ChildrenFC } from '../utils/types';

export const TOKEN_KEY = 'token';

export type AuthenticationContextValueType = {
  login: (newToken: string, newUserName: string) => void;
  logout: () => void;
  userName?: string;
};

const AuthenticationContext = createContext<AuthenticationContextValueType>(
  null as any as AuthenticationContextValueType,
);

export const AuthenticationProvider: ChildrenFC = ({ children }) => {
  const [userName, setUserName] = useState<string>();

  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      router.push('/prihlaseni');
    }
  }, []);

  const login = useCallback((newToken: string, newUserName: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setUserName(newUserName);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUserName(undefined);
    router.push('/prihlaseni');
  }, []);

  const value = useMemo(
    () => ({ login, logout, userName }),
    [login, logout, userName],
  );

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => useContext(AuthenticationContext);
export const useUserName = () => useContext(AuthenticationContext).userName;
