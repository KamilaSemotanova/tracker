import classnames from 'classnames';
import React, { InputHTMLAttributes } from 'react';

import style from './TextField.module.scss';

type TextFieldProps = {
  label: string;
  type: string | 'text';
  className: 'dark' | 'light';
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export const TextField: React.FC<TextFieldProps> = ({
  onChange,
  label,
  type,
  className,
  ...props
}) => (
  <label className={style.labelWrapper}>
    <span className={style.label}>{label}</span>
    <input
      className={classnames(style.input, {
        [style.dark]: className === 'dark',
        [style.light]: className === 'light',
      })}
      onChange={onChange}
      {...props}
      type={type}
    />
  </label>
);
