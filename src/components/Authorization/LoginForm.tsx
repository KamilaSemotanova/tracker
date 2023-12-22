import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

import { trpc } from '../../utils/trpc';
import { useAuthentication } from '../AuthenticationProvider';
import { TextField } from '../TextField/TextField';
import { FormWrapper } from './FormWrapper';
import style from './LoginForm.module.scss';

type LoginFormProps = {
  setWarningMessage: (value: string) => void;
  buttonClassName: string;
};

export const LoginForm: React.FC<LoginFormProps> = ({
  setWarningMessage,
  buttonClassName,
}) => {
  const router = useRouter();
  const { login } = useAuthentication();

  const [loginEmail, setLoginEmail] = useState('kami@kami');
  const [loginPassword, setLoginPassword] = useState('kami');

  const logUser = trpc.user.login.useQuery(
    {
      email: loginEmail || '',
      password: loginPassword || '',
    },
    {
      enabled: false,
      onSuccess: ({ access_token, user }) => {
        login(access_token, user);
        router.push('/');
      },
      onError: () => {
        setWarningMessage('Špatný e-mail nebo heslo');
      },
    },
  );

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      setWarningMessage('Vyplňte všechna pole');
    }

    logUser.refetch();
  };

  return (
    <div className={style.linkWrapper}>
      <FormWrapper
        handleSubmit={handleLogin}
        buttonClassName={buttonClassName}
        buttonLabel="Přihlásit"
      >
        <div className={style.login}>
          <TextField
            id="email"
            type="text"
            placeholder="ukázka@email.com"
            label="E-mail"
            autoFocus
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />

          <TextField
            id="password"
            type="password"
            placeholder="Vaše heslo"
            label="Heslo"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
        </div>
      </FormWrapper>

      <a className={style.link}>Zapomněli jste heslo?</a>
    </div>
  );
};
