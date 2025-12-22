import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export const generateAccessToken = (userId: string, email: string): string => {
  return jwt.sign(
    { id: userId, email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn as any }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn as any }
  );
};

export const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, config.jwt.secret);
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, config.jwt.refreshSecret);
};