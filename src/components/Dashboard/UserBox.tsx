import { useState } from 'react';
import classnames from 'classnames';
import { useRouter } from 'next/router';

import { useUserName } from '../AuthenticationProvider';
import { useAuthentication } from '../AuthenticationProvider';
import style from './UserBox.module.scss';

export const UserBox = () => {
  const [userBoxVisible, setUserBoxVisible] = useState(false);

  const userName = useUserName();

  const router = useRouter();

  const { logout } = useAuthentication();

  const handleRevealUserBox = () => {
    setUserBoxVisible(!userBoxVisible);
  };

  const handleLogOut = () => {
    logout();
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
      <button onClick={handleRevealUserBox} className={style.profileBox}>
        <div className={style.profile} />
        <div
          className={classnames(style.arrow, {
            [style.arrowOpen]: userBoxVisible === true,
          })}
        />
      </button>
      {userBoxVisible && (
        <>
          <h2>{userName}</h2>
          <button
            className={classnames(style.button, style.buttonUpdate)}
            onClick={handleUpdate}
          >
            upravit profil
          </button>
          <button
            className={classnames(style.button, style.buttonLogOut)}
            onClick={handleLogOut}
          >
            odhlásit
          </button>
        </>
      )}
    </div>
  );
};
