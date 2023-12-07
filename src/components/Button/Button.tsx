import classnames from 'classnames';

import style from './Button.module.scss';

type ButtonProps =
  | {
      type: 'submit';
      className?: string;
      children: React.ReactNode;
      onClick?: undefined;
    }
  | {
      type: 'button';
      className?: string;
      children: React.ReactNode;
      onClick: () => void;
    };

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  type,
  onClick,
}) => (
  <button
    className={classnames(style.button, className)}
    onClick={onClick}
    type={type}
  >
    {children}
  </button>
);
