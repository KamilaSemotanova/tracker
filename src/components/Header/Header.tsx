import style from "./Header.module.scss";

export const Header = () => {
  return (
    <header className={style.container}>
      <div className={style.title}>Tracker</div>
    </header>
  );
};
