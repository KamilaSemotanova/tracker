import classnames from 'classnames';

import { ChildrenFC } from '../../utils/types';
import style from './FormWrapper.module.scss';

type FormWrapperProps = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  buttonClassName?: string;
  buttonLabel: string;
};

export const FormWrapper: ChildrenFC<FormWrapperProps> = ({
  children,
  buttonLabel,
  handleSubmit,
  buttonClassName,
}) => (
  <form className={style.container} onSubmit={handleSubmit}>
    {children}

    <button type="submit" className={classnames(buttonClassName, style.submit)}>
      {buttonLabel}
    </button>
  </form>
);
