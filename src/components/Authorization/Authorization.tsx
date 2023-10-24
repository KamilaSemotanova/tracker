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
  const [warningMissingData, setWarningMissingData] = useState(false);
  const [warningPassword, setWarningPassword] = useState(false);

  const router = useRouter();

  const utils = trpc.useContext();
  const addNewUser = trpc.user.createUser.useMutation({
    onSuccess: () => {
      utils.user.invalidate();
    },
  });

  // const getUser = trpc.user.getUser.useQuery({});

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loginEmail && loginPassword) {
      const dataLogin = { name: loginEmail, password: loginPassword };
      console.log(dataLogin);

      setIsLogged(true);
      router.push('/');
    } else {
      setWarningMissingData(true);
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
          // password: registrationPassword,
        });

        setIsLogged(true);
        router.push('/');
      } else {
        setWarningPassword(true);
      }
    } else {
      setWarningMissingData(true);
    }
  };

  const handleReveal = (boolean: boolean) => {
    setRegistrationForm(boolean);
    setWarningMissingData(false);
    setWarningPassword(false);
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
                <div
                  className={classnames(style.warningBox, {
                    [style.missingData]: warningMissingData === true,
                    [style.passwordMismatch]: warningPassword === true,
                  })}
                />
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
                <div
                  className={classnames(style.warningBox, {
                    [style.missingData]: warningMissingData === true,
                  })}
                />
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
