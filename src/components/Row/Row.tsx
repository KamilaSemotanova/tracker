import { ReactNode } from 'react';
import classnames from 'classnames';

import style from './Row.module.scss';

type RowProps = {
  flexCol?: boolean;
  justifyCenter?: boolean;
  justifyStart?: boolean;
  justifyEnd?: boolean;
  justifySpace?: boolean;
  itemsCenter?: boolean;
  itemsStart?: boolean;
  fullWidth?: boolean;
  dataTestId?: string;
  className?: string;
  children: ReactNode;
};

export const Row: React.FC<RowProps> = ({
  children,
  flexCol,
  justifyCenter,
  justifyStart,
  justifyEnd,
  justifySpace,
  itemsCenter,
  itemsStart,
  fullWidth,
  dataTestId,
  className,
}) => (
  <div
    data-testid={dataTestId}
    className={classnames(
      {
        [style.flexCol]: flexCol,
        [style.justifyCenter]: justifyCenter,
        [style.justifyStart]: justifyStart,
        [style.justifyEnd]: justifyEnd,
        [style.justifySpace]: justifySpace,
        [style.itemsCenter]: itemsCenter,
        [style.itemsStart]: itemsStart,
        [style.fullWidth]: fullWidth,
      },
      style.row,
      className,
    )}
  >
    {children}
  </div>
);
