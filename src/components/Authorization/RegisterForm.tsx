import { FormEvent, useRef } from 'react';
import { useRouter } from 'next/router';

import { trpc } from '../../utils/trpc';
import { useAuthentication } from '../AuthenticationProvider';
import { TextField } from '../TextField/TextField';
import { FormWrapper } from './FormWrapper';
import style from './RegisterForm.module.scss';

type RegisterFormData = {
  name: { value: string };
  email: { value: string };
  password: { value: string };
  passwordVerification: { value: string };
};

type RegisterFormProps = {
  setWarningMessage: (value: string) => void;
  buttonClassName: string;
};

export const RegisterForm: React.FC<RegisterFormProps> = ({
  setWarningMessage,
  buttonClassName,
}) => {
  const router = useRouter();
  const formRef = useRef<RegisterFormData>();
  const { login } = useAuthentication();

  const utils = trpc.useContext();
  const addNewUser = trpc.user.register.useMutation({
    onSuccess: ({ access_token, userName, userEmail }) => {
      utils.user.invalidate();
      login(access_token, { name: userName, email: userEmail });
      router.push('/');
    },
    onError: () => {
      setWarningMessage('Registace se nezdařila');
    },
  });

  const handleRegistration = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) {
      return;
    }

    const { name, email, password, passwordVerification } = formRef.current;

    const nameValue = name.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const passwordVerificationValue = passwordVerification.value.trim();

    if (
      !nameValue ||
      !emailValue ||
      !passwordValue ||
      !passwordVerificationValue
    ) {
      setWarningMessage('Vyplňte všechna pole');

      return;
    }

    if (passwordValue !== passwordVerificationValue) {
      setWarningMessage('Hesla se neshodují');

      return;
    }

    addNewUser.mutate({
      name: nameValue,
      email: emailValue,
      password: passwordValue,
    });
  };

  return (
    <FormWrapper
      handleSubmit={handleRegistration}
      buttonClassName={buttonClassName}
      buttonLabel="Registrovat"
      ref={formRef}
    >
      <div className={style.register}>
        <TextField
          id="name"
          type="text"
          placeholder="Jana Nováková"
          label="Jméno a příjmení"
          autoFocus
        />

        <TextField
          name="email"
          type="text"
          placeholder="ukázka@email.com"
          label="E–mail"
        />

        <TextField
          name="password"
          type="password"
          placeholder="Vaše heslo"
          label="Heslo"
        />

        <TextField
          name="passwordVerification"
          type="password"
          placeholder="Vaše heslo"
          label="Ověření hesla"
        />
      </div>
    </FormWrapper>
  );
};
