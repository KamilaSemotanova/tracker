import { FormEvent, useRef } from 'react';
import { useRouter } from 'next/router';

import { trpc } from '../../utils/trpc';
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
      <div className={style.register}>
        <label className={style.label}>
          <span>Jméno a příjmení</span>
          <TextField
            id="name"
            type="text"
            placeholder="Jana Nováková"
            autoFocus
          />
        </label>

        <label className={style.label}>
          <span>E-mail</span>
          <TextField name="email" type="text" placeholder="ukázka@email.com" />
        </label>

        <label className={style.label}>
          <span>Heslo</span>
          <TextField name="password" type="password" placeholder="Vaše heslo" />
        </label>

        <label className={style.label}>
          <span>Ověření hesla</span>
          <TextField
            name="passwordVerification"
            type="password"
            placeholder="Vaše heslo"
          />
        </label>
      </div>
    </FormWrapper>
  );
};
