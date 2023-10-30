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
    <div className={style.linkWrapper}>
      <FormWrapper
        handleSubmit={handleLogin}
        buttonClassName={buttonClassName}
        buttonLabel="Přihlásit"
      >
        <div className={style.login}>
          <label>
            <span className={style.label}>E-mail</span>
            <TextField
              id="email"
              type="text"
              placeholder="ukázka@email.com"
              autoFocus
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </label>
          <label>
            <span className={style.label}>Heslo</span>
            <TextField
              id="password"
              type="password"
              placeholder="Vaše heslo"
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </label>
        </div>
      </FormWrapper>

      <a className={style.link}>Zapomněli jste heslo?</a>
    </div>
  );
};
