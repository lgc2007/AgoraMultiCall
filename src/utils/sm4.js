/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2022-04-12 18:05:42
 * @LastEditors: lgc
 * @LastEditTime: 2022-04-13 10:12:22
 */

const { SM4 } = require('gm-crypto');
export const sm4EncryptedData = (
  password,
  key = '65c00054f4b4f1efac2cb0f62445cd32',
) => {
  const encryptedData = SM4.encrypt(password, key, {
    inputEncoding: 'utf8',
    outputEncoding: 'base64',
  });
  return encryptedData;
};
