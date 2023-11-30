import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import classnames from 'classnames';
import { useRouter } from 'next/router';

import { trpc } from '../../utils/trpc';
import style from './ChangeData.module.scss';

export const ChangeData = () => {
  const [profileState, setProfileState] = useState({});
  const [updatedPassword, setUpdatedPassword] = useState('');
  const [updatedPasswordControl, setUpdatedPasswordControl] = useState('');
  const [warningMessagePassword, setWarningMessagePassword] = useState('');
  const [warningMessageProfile, setWarningMessageProfile] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // const updateProfile = trpc.user.updateUser.useMutation({
  //   onSuccess: () => {
  //     setWarningMessageProfile('Profil byl upraven');
  //   },
  //   onError: () => {
  //     setWarningMessageProfile('Úprava se nezdařila');
  //   },
  // });

  // const updatePassword = trpc.user.updatePassword.useMutation({
  //   onSuccess: () => {
  //     setWarningMessagePassword('Heslo bylo změněno');
  //   },
  //   onError: () => {
  //     setWarningMessagePassword('Úprava se nezdařila');
  //   },
  // });

  const handleSubmitProfile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleSubmitPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (updatedPassword !== updatedPasswordControl) {
      setWarningMessagePassword('hesla se neshodují');
    }
  };

  const handleChangeProfile = (e: ChangeEvent<HTMLInputElement>) => {
    setProfileState({ ...profileState, [e.target.id]: e.target.value });
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === 'password') {
      setUpdatedPassword(e.target.value);
    }

    if (e.target.id === 'controlPassword') {
      setUpdatedPasswordControl(e.target.value);
    }
  };

  const handleReturn = () => {
    router.push('/');
  };

  return (
    <section className={style.changeForm}>
      <div className={style.forms}>
        <div className={style.formBox}>
          <h2 className={style.title}>Upravit profil</h2>
          <form className={style.form} onSubmit={handleSubmitProfile}>
            <label className={style.label}>
              Jméno
              <input
                className={style.input}
                type="text"
                id="name"
                onChange={handleChangeProfile}
              />
            </label>
            <label className={style.label}>
              E-mail
              <input
                className={style.input}
                type="text"
                id="email"
                onChange={handleChangeProfile}
              />
            </label>
            {isVisible && <p>{warningMessageProfile}</p>}
            <button type="submit" className={style.button}>
              Uložit
            </button>
          </form>
        </div>
        <div className={style.formBox}>
          <h2 className={style.title}>Změnit heslo</h2>
          <form className={style.form} onSubmit={handleSubmitPassword}>
            <label className={style.label}>
              Heslo
              <input
                className={style.input}
                type="text"
                id="password"
                onChange={handleChangePassword}
              />
            </label>
            <label className={style.label}>
              Kontrola hesla
              <input
                className={style.input}
                type="text"
                id="controlPassword"
                onChange={handleChangePassword}
              />
            </label>
            {isVisible && <p>{warningMessagePassword}</p>}
            <button type="submit" className={style.button}>
              Uložit
            </button>
          </form>
        </div>
      </div>
      <button
        className={classnames(style.button, style.buttonBack)}
        onClick={handleReturn}
      >
        Zpět
      </button>
    </section>
  );
};
