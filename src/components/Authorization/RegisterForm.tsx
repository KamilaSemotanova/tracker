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
} & HTMLFormElement;

type RegisterFormProps = {
  setWarningMessage: (value: string) => void;
  buttonClassName: string;
};

export const RegisterForm: React.FC<RegisterFormProps> = ({
  setWarningMessage,
  buttonClassName,
}) => {
  const router = useRouter();
  const formRef = useRef<RegisterFormData>(null);
  const { login } = useAuthentication();

  const utils = trpc.useContext();
  const addNewUser = trpc.user.register.useMutation({
    onSuccess: ({ access_token, user }) => {
      utils.user.invalidate();
      login(access_token, { name: user.name, email: user.email });
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

    const { name, email, password, passwordVerification } =
      formRef.current as unknown as RegisterFormData;

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
          className="light"
          label="Jméno a příjmení"
          autoFocus
        />

        <TextField
          name="email"
          type="text"
          placeholder="ukázka@email.com"
          className="light"
          label="E–mail"
        />

        <TextField
          name="password"
          type="password"
          placeholder="Vaše heslo"
          className="light"
          label="Heslo"
        />

        <TextField
          name="passwordVerification"
          type="password"
          placeholder="Vaše heslo"
          className="light"
          label="Ověření hesla"
        />
      </div>
    </FormWrapper>
  );
};
