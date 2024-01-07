import React, { InputHTMLAttributes } from 'react';
import classnames from 'classnames';

import style from './TextField.module.scss';

type TextFieldProps = {
  label: string;
  variant?: 'dark' | 'light';
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
