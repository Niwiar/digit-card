const crypto = require('crypto-js');

const key = 'privaInnotech@';

const encrypt = (data) => crypto.AES.encrypt(data, key);

const decrypt = (data) =>
  crypto.AES.decrypt(data, key).toString(crypto.enc.Utf8);

const decryptCardInfo = (Card) => {
  let { Fname, Lname, Tel } = Card;
  let deFname, deLname, deTel;
  Fname === null ? (deFname = '') : (deFname = decrypt(Fname));
  Lname === null ? (deLname = '') : (deLname = decrypt(Lname));
  Tel === null ? (deTel = '') : (deTel = decrypt(Tel));
  return { deFname, deLname, deTel };
};

module.exports = {
  encrypt,
  decrypt,
  decryptCardInfo,
};
