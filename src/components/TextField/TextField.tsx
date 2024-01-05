import classnames from 'classnames';
import React, { InputHTMLAttributes } from 'react';

import style from './TextField.module.scss';

type TextFieldProps = {
  label: string;
  type: string | 'text';
  variant?: 'dark' | 'light';
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export const TextField: React.FC<TextFieldProps> = ({
  onChange,
  label,
  type,
  variant = 'dark',
  ...props
}) => (
  <label className={style.labelWrapper}>
    <span className={style.label}>{label}</span>
    <input
      className={classnames(style.input, {
        [style.dark]: variant === 'dark',
        [style.light]: variant === 'light',
      })}
      onChange={onChange}
      {...props}
      type={type}
    />
  </label>
);
