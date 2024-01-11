import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

import { ChildrenFC } from '../utils/types';

export const TOKEN_KEY = 'token';

export type AuthenticationContextValueType = {
  login: (newToken: string, newUser: { name: string; email: string }) => void;
  logout: () => void;
  user?: { name: string; email: string };
  setUser: (newUser: { name: string; email: string }) => void;
};

const AuthenticationContext = createContext<AuthenticationContextValueType>(
  null as any as AuthenticationContextValueType,
);

export const AuthenticationProvider: ChildrenFC = ({ children }) => {
  const [user, setUser] = useState({ name: '', email: '' });

  const router = useRouter();

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');

    if (!jwtToken) {
      return;
    }

    const decodedToken = jwt.decode(jwtToken);

    if (!decodedToken) {
      return;
    }

    setUser({
      name: user.name || (decodedToken as any).name,
      email: user.email || (decodedToken as any).email,
    });
  }, []);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      router.push('/prihlaseni');
    }
  }, []);

  const login = useCallback(
    (newToken: string, newUser: { name: string; email: string }) => {
      localStorage.setItem(TOKEN_KEY, newToken);
      setUser({ name: newUser.name, email: newUser.email });
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser({ name: '', email: '' });
    router.push('/prihlaseni');
  }, []);

  const value = useMemo(
    () => ({ login, logout, user, setUser }),
    [login, logout, user, setUser],
  );

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => useContext(AuthenticationContext);
