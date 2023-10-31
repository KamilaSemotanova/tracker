import React, { InputHTMLAttributes } from 'react';

import style from './TextField.module.scss';

type TextFieldProps = {
  label: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export const TextField: React.FC<TextFieldProps> = ({
  onChange,
  label,
  ...props
}) => (
  <label>
    <span className={style.label}> {label} </span>
    <input className={style.input} onChange={onChange} {...props} />
  </label>
);
