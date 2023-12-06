import { useState } from 'react';
import classnames from 'classnames';
import { useRouter } from 'next/router';

import { useUserName } from '../AuthenticationProvider';
import { useAuthentication } from '../AuthenticationProvider';
import { Row } from '../Row/Row';
import { Button } from '../Button/Button';
import style from './UserBox.module.scss';

export const UserBox = () => {
  const [userBoxVisible, setUserBoxVisible] = useState(false);

  const userName = useUserName();
  const router = useRouter();
  const { logout } = useAuthentication();

  const handleRevealUserBox = () => {
    setUserBoxVisible(!userBoxVisible);
  };

  const handleUpdate = () => {
    router.push('/zmena');
  };

  return (
    <Row
      flexCol
      justifyCenter
      itemsCenter
      className={classnames({
        [style.userBoxOpen]: userBoxVisible,
      })}
    >
      <button onClick={handleRevealUserBox} className={style.profileBox}>
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
            label="upravit profil"
            onClick={handleUpdate}
          />
          <Button
            type="button"
            className={style.buttonLogOut}
            label="odhlásit"
            onClick={logout}
          />
        </>
      )}
    </Row>
  );
};
