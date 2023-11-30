import style from './StrikeCounter.module.scss';

export const StreekCounter = (dayStreek: number) => (
  <div className={style.container}>
    <div className={style.counter}>
      <p className={style.number}>{dayStreek}</p>
    </div>
    <p>dní</p>
  </div>
);
