import { FormEvent, useRef } from 'react';
import { useRouter } from 'next/router';

import { trpc } from '../../utils/trpc';
import { TextField } from '../TextField/TextField';
import { Row } from '../Row/Row';
import { FormWrapper } from './FormWrapper';

type RegisterFormData = {
  name: { value: string };
  email: { value: string };
  password: { value: string };
  passwordVerification: { value: string };
};

type RegisterFormProps = {
  setIsLogged: (value: boolean) => void;
  setWarningMessage: (value: string) => void;
  buttonClassName: string;
};

export const RegisterForm: React.FC<RegisterFormProps> = ({
  setIsLogged,
  setWarningMessage,
  buttonClassName,
}) => {
  const router = useRouter();
  const formRef = useRef<RegisterFormData>();

  const utils = trpc.useContext();
  const addNewUser = trpc.user.register.useMutation({
    onSuccess: () => {
      utils.user.invalidate();
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

    setIsLogged(true);
    router.push('/');
  };

  return (
    <FormWrapper
      handleSubmit={handleRegistration}
      buttonClassName={buttonClassName}
      buttonLabel="Register"
      ref={formRef}
    >
      <Row flexCol>
        <label>
          Jméno a příjmení
          <TextField
            id="name"
            type="text"
            placeholder="Jméno a příjmení"
            autoFocus
          />
        </label>

        <label>
          E-mail
          <TextField name="email" type="text" placeholder="E-mail" />
        </label>

        <label>
          Heslo
          <TextField name="password" type="password" placeholder="Heslo" />
        </label>

        <label>
          Ověření hesla
          <TextField
            name="passwordVerification"
            type="password"
            placeholder="Ověření hesla"
          />
        </label>
      </Row>
    </FormWrapper>
  );
};
