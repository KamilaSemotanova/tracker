import { useState } from 'react';
import { useRouter } from 'next/router';

import { ChangeProfile } from './ChangeProfile';
import { ChangePassword } from './ChangePassword';
import { Button } from '../Button/Button';
import style from './ChangeData.module.scss';

export const ChangeData = () => {
  const [warningMessage, setWarningMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();

  const handleReturn = () => {
    router.push('/');
  };

  return (
    <section className={style.changeForm}>
      <div className={style.forms}>
        <ChangeProfile
          setWarningMessage={setWarningMessage}
          setIsVisible={setIsVisible}
        />
        <ChangePassword
          setWarningMessage={setWarningMessage}
          setIsVisible={setIsVisible}
        />
      </div>
      {isVisible && <p>{warningMessage}</p>}
      <Button
        type="button"
        className={style.buttonBack}
        label="Zpět"
        onClick={handleReturn}
      />
    </section>
  );
};
