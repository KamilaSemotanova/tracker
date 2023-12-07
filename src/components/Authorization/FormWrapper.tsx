import { forwardRef } from 'react';
import classnames from 'classnames';

import { Button } from '../Button/Button';
import style from './FormWrapper.module.scss';

type FormWrapperProps = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  buttonClassName?: string;
  buttonLabel: string;
  children: React.ReactNode;
};

export const FormWrapper = forwardRef<any, FormWrapperProps>(
  ({ children, buttonLabel, handleSubmit, buttonClassName }, ref) => (
    <form ref={ref} className={style.container} onSubmit={handleSubmit}>
      {children}
      <Button
        type="submit"
        className={classnames(buttonClassName, style.submit)}
      >
        {buttonLabel}
      </Button>
    </form>
  ),
);
