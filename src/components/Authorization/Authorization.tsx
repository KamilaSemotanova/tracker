import { useState } from 'react';
import classnames from 'classnames';

import { Row } from '../Row/Row';
import { RegisterForm } from './RegisterForm';
import { LoginForm } from './LoginForm';
import { Button } from '../Button/Button';
import style from './Authorization.module.scss';

export const Authorization: React.FC = () => {
  const [registrationForm, setRegistrationForm] = useState(false);

  const [warningMessage, setWarningMessage] = useState('');

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
            <Button
              type="button"
              className={classnames(style.button, style.buttonTop, {
                [style.active]: registrationForm === false,
              })}
              onClick={() => handleReveal(false)}
            >
              Přihlásit
            </Button>
            <Button
              type="button"
              className={classnames(style.button, style.buttonTop, {
                [style.active]: registrationForm === true,
              })}
              onClick={() => handleReveal(true)}
            >
              Registrovat
            </Button>
          </Row>
          <div className={style.formContainer}>
            {registrationForm ? (
              <RegisterForm
                setWarningMessage={setWarningMessage}
                buttonClassName={style.button}
              />
            ) : (
              <LoginForm
                setWarningMessage={setWarningMessage}
                buttonClassName={style.button}
              />
            )}

            <div className={style.warningBox}>{warningMessage}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
