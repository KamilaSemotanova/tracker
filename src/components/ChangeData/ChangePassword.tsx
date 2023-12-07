import { FormEvent, useState } from 'react';

import { trpc } from '../../utils/trpc';
import { TextField } from '../TextField/TextField';
import { Button } from '../Button/Button';
import style from './ChangePassword.module.scss';

type ChangePasswordProps = {
  setWarningMessage: (value: string) => void;
  setIsVisible: (value: boolean) => void;
};

export const ChangePassword: React.FC<ChangePasswordProps> = ({
  setWarningMessage,
  setIsVisible,
}) => {
  const [updatedPassword, setUpdatedPassword] = useState('');
  const [updatedPasswordControl, setUpdatedPasswordControl] = useState('');

  const updatePassword = trpc.user.updatePassword.useMutation({
    onSuccess: () => {
      setWarningMessage('Heslo bylo změněno');
    },
    onError: () => {
      setWarningMessage('Úprava se nezdařila');
    },
  });

  const handleSubmitPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (updatedPassword !== updatedPasswordControl) {
      setWarningMessage('Hesla se neshodují');
      setIsVisible(true);

      return;
    }

    updatePassword.mutate({ password: updatedPassword });
  };

  return (
    <div className={style.formBox}>
      <h2 className={style.title}>Změnit heslo</h2>
      <form className={style.form} onSubmit={handleSubmitPassword}>
        <TextField
          id="password"
          type="text"
          label="Heslo"
          autoFocus
          value={updatedPassword}
          onChange={(e) => setUpdatedPassword(e.target.value)}
          className={style.textField}
        />
        <TextField
          id="controlPassword"
          type="text"
          label="Kontrola hesla"
          value={updatedPasswordControl}
          onChange={(e) => setUpdatedPasswordControl(e.target.value)}
          className={style.textField}
        />
        <Button type="submit" className={style.button}>
          uložit
        </Button>
      </form>
    </div>
  );
};
