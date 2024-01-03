import { useRouter } from 'next/router';

import { Button } from '../Button/Button';
import { ChangePassword } from './ChangePassword';
import { ChangeProfile } from './ChangeProfile';
import style from './ChangeData.module.scss';

export const ChangeData = () => {
  const router = useRouter();

  const handleReturn = () => {
    router.push('/');
  };

  return (
    <section className={style.changeForm}>
      <div className={style.forms}>
        <ChangeProfile />
        <ChangePassword />
      </div>
      <Button type="button" className={style.buttonBack} onClick={handleReturn}>
        zpět
      </Button>
    </section>
  );
};
