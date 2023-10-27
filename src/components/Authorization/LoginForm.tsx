import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

import { trpc } from '../../utils/trpc';
import { TextField } from '../TextField/TextField';
import { FormWrapper } from './FormWrapper';
import style from './LoginForm.module.scss';

type LoginFormProps = {
  setIsLogged: (value: boolean) => void;
  setWarningMessage: (value: string) => void;
  buttonClassName: string;
};

export const LoginForm: React.FC<LoginFormProps> = ({
  setIsLogged,
  setWarningMessage,
  buttonClassName,
}) => {
  const router = useRouter();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const { refetch } = trpc.user.login.useQuery(
    {
      email: loginEmail || '',
      password: loginPassword || '',
    },
    {
      enabled: false,
    },
  );

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      setWarningMessage('Vyplňte všechna pole');

      return;
    }

    const { data: matchingUser } = await refetch();

    if (
      loginEmail !== matchingUser?.email ||
      loginPassword !== matchingUser?.password
    ) {
      setWarningMessage('Špatné přihlašovací údaje');

      return;
    }

    setIsLogged(true);
    router.push('/');
  };

  return (
    <>
      <FormWrapper
        handleSubmit={handleLogin}
        buttonClassName={buttonClassName}
        buttonLabel="Přihlásit"
      >
        <TextField
          id="email"
          type="text"
          placeholder="E-mail"
          autoFocus
          onChange={(e) => setLoginEmail(e.target.value)}
        />

        <TextField
          id="password"
          type="password"
          placeholder="Heslo"
          onChange={(e) => setLoginPassword(e.target.value)}
        />
      </FormWrapper>

      <a className={style.link}>Zapomněli jste heslo?</a>
    </>
  );
};
