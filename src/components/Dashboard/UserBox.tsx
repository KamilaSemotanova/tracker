import { useState } from 'react';
import classnames from 'classnames';
import { useRouter } from 'next/router';

import { useAuthentication } from '../AuthenticationProvider';
import { Button } from '../Button/Button';
import style from './UserBox.module.scss';

export const UserBox = () => {
  const [userBoxVisible, setUserBoxVisible] = useState(false);

  const router = useRouter();
  const { logout, userName } = useAuthentication();

  const handleRevealUserBox = () => {
    setUserBoxVisible(!userBoxVisible);
  };

  const handleUpdate = () => {
    router.push('/zmena');
  };

  return (
    <div
      className={classnames(style.userBox, {
        [style.userBoxOpen]: userBoxVisible === true,
      })}
    >
      <button
        onClick={handleRevealUserBox}
        className={style.profileBox}
        aria-label="Otevřít box k upravení profilu a odhlášení."
      >
        <div className={style.profile} />
        <div
          className={classnames(style.arrow, {
            [style.arrowOpen]: userBoxVisible,
          })}
        />
      </button>
      {userBoxVisible && (
        <>
          <h2>{userName}</h2>
          <Button
            type="button"
            className={style.buttonUpdate}
            onClick={handleUpdate}
          >
            upravit profil
          </Button>
          <Button type="button" className={style.buttonLogOut} onClick={logout}>
            odhlásit
          </Button>
        </>
      )}
    </div>
  );
};
