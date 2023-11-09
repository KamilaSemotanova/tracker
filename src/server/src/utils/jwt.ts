import jwt, { SignOptions } from 'jsonwebtoken';

import customConfig from '../config/default';

export const signJwt = (
  payload: object,
  key: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options: SignOptions = {},
) => {
  const privateKey = Buffer.from(customConfig[key], 'base64').toString('ascii');

  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};
