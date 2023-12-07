import { FormEvent, useState } from 'react';

import { trpc } from '../../utils/trpc';
import { TextField } from '../TextField/TextField';
import { Button } from '../Button/Button';
import style from './ChangeProfile.module.scss';

type ChangeProfileProps = {
  setWarningMessage: (value: string) => void;
  setIsVisible: (value: boolean) => void;
};

export const ChangeProfile: React.FC<ChangeProfileProps> = ({
  setWarningMessage,
  setIsVisible,
}) => {
  const [updatedName, setUpdatedName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');

  const updateProfile = trpc.user.updateUser.useMutation({
    onSuccess: () => {
      setWarningMessage('Profil byl upraven');
      setIsVisible(true);
    },
    onError: () => {
      setWarningMessage('Úprava se nezdařila');
      setIsVisible(true);
    },
  });

  const handleSubmitProfile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        />
        <TextField
          id="email"
          type="text"
          label="E-mail"
          value={updatedEmail}
          onChange={(e) => setUpdatedEmail(e.target.value)}
          className={style.textField}
        />
        <Button type="submit" className={style.button}>
          uložit
        </Button>
      </form>
    </div>
  );
};
