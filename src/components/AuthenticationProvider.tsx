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
  user?: { name: string; email: string };
};

const AuthenticationContext = createContext<AuthenticationContextValueType>(
  null as any as AuthenticationContextValueType,
);

export const AuthenticationProvider: ChildrenFC = ({ children }) => {
  const [user, setUser] = useState({ name: '', email: '' });

  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      router.push('/prihlaseni');
    }
  }, []);

  const login = useCallback(
    (newToken: string, newUserName: string, newUserEmail: string) => {
      localStorage.setItem(TOKEN_KEY, newToken);
      setUser({ name: newUserName, email: newUserEmail });
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser({ name: '', email: '' });
    router.push('/prihlaseni');
  }, []);

  const value = useMemo(() => ({ login, logout, user }), [login, logout, user]);

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => useContext(AuthenticationContext);
