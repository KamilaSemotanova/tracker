import { ChangeEvent, FormEvent, useState } from 'react';

// import style from './ChangeData.module.scss';

export const ChangeData = () => {
  const [profileState, setProfileState] = useState({});
  const [passwordState, setPasswordState] = useState({});

  const handleSubmitProfile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // console.log(profileState);
  };

  const handleSubmitPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // console.log(passwordState);
  };

  const handleChangeProfile = (e: ChangeEvent<HTMLInputElement>) => {
    setProfileState({ ...profileState, [e.target.id]: e.target.value });
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.id) {
      setPasswordState({ ...passwordState, [e.target.id]: e.target.value });
    }
  };

  return (
    <section>
      <h2>Upravit profil</h2>
      <form onSubmit={handleSubmitProfile}>
        <label>
          Jméno
          <input type="text" id="name" onChange={handleChangeProfile} />
        </label>
        <label>
          E-mail
          <input type="text" id="email" onChange={handleChangeProfile} />
        </label>
        <button type="submit">Uložit</button>
      </form>
      <h2>Změnit heslo</h2>
      <form onSubmit={handleSubmitPassword}>
        <label>
          Heslo
          <input type="text" id="password" onChange={handleChangePassword} />
        </label>
        <label>
          Kontrola hesla
          <input
            type="text"
            id="controlPassword"
            onChange={handleChangePassword}
          />
        </label>
        <button type="submit">Uložit</button>
      </form>
    </section>
  );
};
