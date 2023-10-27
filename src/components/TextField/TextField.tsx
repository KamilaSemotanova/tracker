import React, { InputHTMLAttributes } from 'react';

import style from './TextField.module.scss';

type TextFieldProps = {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export const TextField: React.FC<TextFieldProps> = ({ onChange, ...props }) => (
  <label>
    <input className={style.input} onChange={onChange} {...props} />
  </label>
);
