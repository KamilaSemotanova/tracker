import jwt, { SignOptions } from 'jsonwebtoken';

type Payload = {
  sub: number;
};

export const signJwt = (payload: Payload, options: SignOptions = {}) => {
  const privateKey = Buffer.from(process.env.TOKEN_PRIVATE_KEY || '', 'base64');

  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJwt = (token: string) => {
  try {
    const publicKey = Buffer.from(process.env.TOKEN_PUBLIC_KEY || '', 'base64');

    return jwt.verify(token, publicKey) as unknown as Payload;
  } catch (error) {
    return null;
  }
};
