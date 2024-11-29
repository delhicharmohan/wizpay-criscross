import crypto from 'crypto-js';

export const generateHash = (plainText) => {
  const secretKey = 's23e4567e89b12d3a45642661417400s';
  return crypto.HmacSHA256(plainText, secretKey).toString(crypto.enc.Base64);
};

export const generateOrderId = () => {
  return crypto.lib.WordArray.random(16).toString();
}; 