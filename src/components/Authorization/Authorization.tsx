import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import classnames from 'classnames';

import { trpc } from '../../utils/trpc';
import { Row } from '../Row/Row';
import style from './Authorization.module.scss';

export const Authorization = ({
  setIsLogged,
}: {
  setIsLogged: (value: boolean) => void;
}) => {
  const [registrationForm, setRegistrationForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registrationName, setRegistrationName] = useState('');
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [registrationPassword, setRegistrationPassword] = useState('');
  const [passwordVerification, setPasswordVerification] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  const router = useRouter();

  const utils = trpc.useContext();
  const addNewUser = trpc.user.register.useMutation({
    onSuccess: () => {
      utils.user.invalidate();
    },
  });

  const findUser = trpc.user.login.useQuery({
    email: loginEmail,
    password: loginPassword,
  });

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loginEmail && loginPassword) {
      if (
        loginEmail === findUser.data?.email &&
        loginPassword === findUser.data?.password
      ) {
        setIsLogged(true);
        router.push('/');
      } else {
        setWarningMessage('Špatné přihlašovací údaje');
      }
    } else {
      setWarningMessage('Vyplňte všechna pole');
    }
  };

  const handleRegistration = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      registrationName &&
      registrationEmail &&
      registrationPassword &&
      passwordVerification
    ) {
      if (registrationPassword === passwordVerification) {
        // success
        addNewUser.mutate({
          name: registrationName,
          email: registrationEmail,
          password: registrationPassword,
        });

        setIsLogged(true);
        router.push('/');
      } else {
        setWarningMessage('Hesla se neshodují');
      }
    } else {
      setWarningMessage('Vyplňte všechna pole');
    }
  };

  const handleReveal = (boolean: boolean) => {
    setRegistrationForm(boolean);
    setWarningMessage('');
  };

  return (
    <section className={style.container}>
      <div className={style.authorization}>
        <div>
          <h2>Vítejte,</h2>
          <p>
            v aplikaci Tracker, která je vytvořena k zaznamenávání aktivit.
            Mapujte svůj progres!
          </p>
        </div>
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
                    onChange={(e) => setRegistrationName(e.target.value)}
                    autoFocus
                  />
                </label>
                <label>
                  <input
                    type="text"
                    placeholder="E-mail"
                    className={style.input}
                    onChange={(e) => setRegistrationEmail(e.target.value)}
                  />
                </label>
                <label>
                  <input
                    type="password"
                    placeholder="Heslo"
                    className={style.input}
                    onChange={(e) => setRegistrationPassword(e.target.value)}
                  />
                </label>
                <label>
                  <input
                    type="password"
                    placeholder="Ověření hesla"
                    className={style.input}
                    onChange={(e) => setPasswordVerification(e.target.value)}
                  />
                </label>
                <div className={style.warningBox}>{warningMessage}</div>
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
                    onChange={(e) => setLoginEmail(e.target.value)}
                    autoFocus
                  />
                </label>
                <label>
                  <input
                    type="password"
                    placeholder="Heslo"
                    className={style.input}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </label>
                <div className={style.warningBox}>{warningMessage}</div>
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
