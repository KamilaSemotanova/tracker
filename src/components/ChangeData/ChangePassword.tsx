import { FormEvent, useState } from 'react';

import { trpc } from '../../utils/trpc';
import { Button } from '../Button/Button';
import { TextField } from '../TextField/TextField';
import style from './ChangePassword.module.scss';

export const ChangePassword = () => {
  const [updatedPassword, setUpdatedPassword] = useState('');
  const [updatedPasswordControl, setUpdatedPasswordControl] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

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

    if (updatedPassword === '' || updatedPasswordControl === '') {
      setWarningMessage('Vyplňte obě pole');

      return;
    }

    if (updatedPassword !== updatedPasswordControl) {
      setWarningMessage('Hesla se neshodují');

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
          type="password"
          label="Heslo"
          autoFocus
          value={updatedPassword}
          onChange={(e) => setUpdatedPassword(e.target.value)}
        />
        <TextField
          id="controlPassword"
          type="password"
          label="Kontrola hesla"
          value={updatedPasswordControl}
          onChange={(e) => setUpdatedPasswordControl(e.target.value)}
        />
        <p className={style.warning}>{warningMessage}</p>
        <Button type="submit" className={style.button}>
          uložit
        </Button>
      </form>
    </div>
  );
};
