import {
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
  login: (newToken: string, newUserName: string, newUserEmail: string) => void;
  logout: () => void;
  userName?: string;
  userEmail?: string;
};

const AuthenticationContext = createContext<AuthenticationContextValueType>(
  null as any as AuthenticationContextValueType,
);

export const AuthenticationProvider: ChildrenFC = ({ children }) => {
  const [userName, setUserName] = useState<string>();
  const [userEmail, setUserEmail] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      router.push('/prihlaseni');
    }
  }, []);

  const login = useCallback(
    (newToken: string, newUserName: string, newUserEmail: string) => {
      localStorage.setItem(TOKEN_KEY, newToken);
      setUserName(newUserName);
      setUserEmail(newUserEmail);
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUserName(undefined);
    setUserEmail('');
    router.push('/prihlaseni');
  }, []);

  const value = useMemo(
    () => ({ login, logout, userName, userEmail }),
    [login, logout, userName, userEmail],
  );

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => useContext(AuthenticationContext);
