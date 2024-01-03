import { FormEvent, useState } from 'react';

import { trpc } from '../../utils/trpc';
import { useAuthentication } from '../AuthenticationProvider';
import { Button } from '../Button/Button';
import { TextField } from '../TextField/TextField';
import style from './ChangeProfile.module.scss';

export const ChangeProfile = () => {
  const [updatedName, setUpdatedName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  const { user } = useAuthentication();

  const updateProfile = trpc.user.updateUser.useMutation({
    onSuccess: () => {
      setWarningMessage('Profil byl upraven');
    },
    onError: () => {
      setWarningMessage('Úprava se nezdařila');
    },
  });

  const handleSubmitProfile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (updatedName === '' && updatedEmail === '') {
      setWarningMessage('Vyplňte alespoň jedno pole');

      return;
    }

    updateProfile.mutate({
      name: updatedName,
      email: updatedEmail,
    });
  };

  return (
    <div className={style.formBox}>
      <h2 className={style.title}>Upravit profil</h2>
      <form className={style.form} onSubmit={handleSubmitProfile}>
        <TextField
          id="name"
          type="text"
          label="Jméno"
          autoFocus
          value={updatedName}
          onChange={(e) => setUpdatedName(e.target.value)}
          className={style.textField}
          placeholder={user?.name}
        />
        <TextField
          id="email"
          type="text"
          label="E-mail"
          value={updatedEmail}
          onChange={(e) => setUpdatedEmail(e.target.value)}
          className={style.textField}
          placeholder={user?.email}
        />
        <p className={style.warning}>{warningMessage}</p>
        <Button type="submit" className={style.button}>
          upravit
        </Button>
      </form>
    </div>
  );
};
