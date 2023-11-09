export const isBrowser = () => typeof window !== 'undefined';

export const isServer = () => typeof window === 'undefined';
