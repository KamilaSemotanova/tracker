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

  const [loginEmail, setLoginEmail] = useState('testing2@test.com');
  const [loginPassword, setLoginPassword] = useState('Marecek123');

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
            type="email"
            placeholder="ukázka@email.com"
            variant="light"
            label="E-mail"
            autoFocus
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />

          <TextField
            id="password"
            type="password"
            placeholder="Vaše heslo"
            variant="light"
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
