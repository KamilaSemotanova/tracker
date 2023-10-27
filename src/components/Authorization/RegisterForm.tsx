import { FormEvent } from 'react';
import { useRouter } from 'next/router';

import { trpc } from '../../utils/trpc';
import { TextField } from '../TextField/TextField';
import { Row } from '../Row/Row';
import { FormWrapper } from './FormWrapper';

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

  const utils = trpc.useContext();
  const addNewUser = trpc.user.register.useMutation({
    onSuccess: () => {
      utils.user.invalidate();
    },
  });

  const handleRegistration = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const registrationName = (e.target as any)[0].value;
    const registrationEmail = (e.target as any)[1].value;
    const registrationPassword = (e.target as any)[2].value;
    const passwordVerification = (e.target as any)[3].value;

    if (
      !registrationName ||
      !registrationEmail ||
      !registrationPassword ||
      !passwordVerification
    ) {
      setWarningMessage('Vyplňte všechna pole');

      return;
    }

    if (registrationPassword !== passwordVerification) {
      setWarningMessage('Hesla se neshodují');

      return;
    }

    addNewUser.mutate({
      name: registrationName,
      email: registrationEmail,
      password: registrationPassword,
    });

    setIsLogged(true);
    router.push('/');
  };

  return (
    <FormWrapper
      handleSubmit={handleRegistration}
      buttonClassName={buttonClassName}
      buttonLabel="Register"
    >
      <Row flexCol>
        <TextField
          id="name"
          type="text"
          placeholder="Jméno a příjmení"
          autoFocus
        />

        <TextField id="email" type="text" placeholder="E-mail" />

        <TextField id="password" type="password" placeholder="Heslo" />

        <TextField id="name" type="password" placeholder="Ověření hesla" />
      </Row>
    </FormWrapper>
  );
};
