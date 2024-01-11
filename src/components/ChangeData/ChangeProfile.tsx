import { FormEvent, useState } from 'react';

import { trpc } from '../../utils/trpc';
import { Button } from '../Button/Button';
import { TextField } from '../TextField/TextField';
import { useAuthentication } from '../AuthenticationProvider';
import style from './ChangeProfile.module.scss';

export const ChangeProfile = () => {
  const { user, setUser } = useAuthentication();

  const [updatedName, setUpdatedName] = useState(user?.name || '');
  const [updatedEmail, setUpdatedEmail] = useState(user?.email || '');
  const [warningMessage, setWarningMessage] = useState('');

  const updateProfile = trpc.user.updateUser.useMutation({
    onSuccess: ({ name, email }) => {
      setUser({ name, email });
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
        />
        <TextField
          id="email"
          type="email"
          label="E-mail"
          value={updatedEmail}
          onChange={(e) => setUpdatedEmail(e.target.value)}
        />
        <p className={style.warning}>{warningMessage}</p>
        <Button type="submit" className={style.button}>
          upravit
        </Button>
      </form>
    </div>
  );
};
