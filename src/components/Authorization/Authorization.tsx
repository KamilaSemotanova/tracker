import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import classnames from 'classnames';

import { Row } from '../Row/Row';
import style from './Authorization.module.scss';

export const Authorization = ({ setIsLogged }) => {
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
    setRegistrationForm(boolean);
  };

  return (
    <section className={style.container}>
      <div className={style.authorization}>
        <h2>Vítejte,</h2>
        <p>
          v aplikaci Tracker, která je vytvořena k zaznamenávání aktivit.
          Mapujte svůj progres!
        </p>
        <div className={style.formBox}>
          <Row>
            <button
              onClick={() => handleReveal(false)}
              className={classnames(style.button, style.buttonTop, {
                [style.active]: registrationForm === false,
              })}
            >
              Přihlásit
            </button>
            <button
              onClick={() => handleReveal(true)}
              className={classnames(style.button, style.buttonTop, {
                [style.active]: registrationForm === true,
              })}
            >
              Registrovat
            </button>
          </Row>
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
                    autoFocus
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
                  type="submit"
                  className={classnames(style.button, style.submit)}
                >
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
                    autoFocus
                  />
                </label>
                <label>
                  <input
                    type="password"
                    placeholder="Heslo"
                    className={style.input}
                  />
                </label>
                <a className={style.link}>Zapomněli jste heslo?</a>
                <button
                  type="submit"
                  className={classnames(style.button, style.submit)}
                >
                  Přihlásit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
