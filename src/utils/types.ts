import { ReactNode } from 'react';

export type ChildrenFC<T = unknown> = React.FC<T & { children: ReactNode }>;
