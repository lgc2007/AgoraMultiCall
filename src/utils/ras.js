import JSEncrypt from 'jsencrypt';
const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCHQh8qVJF1nJ0A-iL_ksa9kcF9-GmQ8BidUg5p78jjeuSBDaR-vc6jM9SxPmfWPfEOtXrIQj0y3_isEv1Z8PeSO1pLt2pP5gSgp3OATChDz--T46dkQpkAIw3bsWkS6RAgEssRvr6xWsD112wMDI2z6K8XbCPbCPDA3tRiTdKwtQIDAQAB';

// 加密方法
export function RSAencrypt(pas) {
  const jse = new JSEncrypt();
  jse.setPublicKey(publicKey);
  return jse.encrypt(pas);
}

// 解密方法 暂时用不到
export function RSAdecrypt(pas) {
  const jse = new JSEncrypt();
  jse.setPrivateKey(this.privateKey);
  return jse.decrypt(pas);
}
