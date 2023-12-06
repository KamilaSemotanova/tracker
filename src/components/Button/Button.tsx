import classnames from 'classnames';

import style from './Button.module.scss';

type ButtonProps =
  | {
      type: 'submit';
      className?: string;
      label: string;
      onClick?: undefined;
    }
  | {
      type: 'button';
      className?: string;
      label: string;
      onClick: () => void;
    };

export const Button: React.FC<ButtonProps> = ({
  className,
  label,
  type,
  onClick,
}) => (
  <button
    className={classnames(style.button, className)}
    onClick={onClick}
    type={type}
  >
    {label}
  </button>
);
