import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import classnames from 'classnames';

import style from './Authorization.module.scss';

export const Authorization = ({ setIsLogged }) => {
  const [revealForm, setRevealForm] = useState(false);
  const [registrationForm, setRegistrationForm] = useState(false);

  const router = useRouter();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLogged(true);
    router.push('/');
  };

  const handleRegistration = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLogged(true);
    router.push('/');
  };

  const handleReveal = (boolean: boolean) => {
    setRevealForm(true);
    setRegistrationForm(boolean);
  };

  return (
    <div className={style.authorization}>
      <h2>Vítejte,</h2>
      <p>
        v aplikaci Tracker, která je vytvořena k zaznamenávání aktivit. Mapujte
        svůj progres!
      </p>

      {!revealForm ? (
        <div className={style.buttonBox}>
          <button onClick={() => handleReveal(false)} className={style.button}>
            Přihlásit
          </button>
          <button onClick={() => handleReveal(true)} className={style.button}>
            Registrovat
          </button>
        </div>
      ) : (
        <div>
          <div
            className={classnames({
              [style.hide]: registrationForm === false,
            })}
          >
            <form className={style.form} onSubmit={handleRegistration}>
              <label>
                <input
                  type="text"
                  placeholder="Jméno a příjmení"
                  className={style.input}
                />
              </label>
              <label>
                <input
                  type="text"
                  placeholder="E-mail"
                  className={style.input}
                />
              </label>
              <label>
                <input
                  type="password"
                  placeholder="Heslo"
                  className={style.input}
                />
              </label>
              <label>
                <input
                  type="password"
                  placeholder="Ověření hesla"
                  className={style.input}
                />
              </label>
              <button
                className={style.link}
                onClick={() => {
                  handleReveal(false);
                }}
              >
                Máte již účet?
              </button>
              <button type="submit" className={style.button}>
                Zaregistrovat
              </button>
            </form>
          </div>
          <div
            className={classnames({
              [style.hide]: registrationForm === true,
            })}
          >
            <form className={style.form} onSubmit={handleLogin}>
              <label>
                <input
                  type="text"
                  placeholder="E-mail"
                  className={style.input}
                />
              </label>
              <label>
                <input
                  type="password"
                  placeholder="Heslo"
                  className={style.input}
                />
              </label>
              <button className={style.link}>Zapomněli jste heslo?</button>
              <button className={style.link} onClick={() => handleReveal(true)}>
                Nemáte ještě účet?
              </button>
              <button type="submit" className={style.button}>
                Přihlásit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
