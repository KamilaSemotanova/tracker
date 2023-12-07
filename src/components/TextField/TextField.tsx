import React, { InputHTMLAttributes } from 'react';
import classnames from 'classnames';

import style from './TextField.module.scss';

type TextFieldProps = {
  label: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export const TextField: React.FC<TextFieldProps> = ({
  onChange,
  label,
  className,
  ...props
}) => (
  <label className={style.labelWrapper}>
    <span className={style.label}>{label}</span>
    <input
      className={classnames(style.input, className)}
      onChange={onChange}
      {...props}
      type="text"
    />
  </label>
);
