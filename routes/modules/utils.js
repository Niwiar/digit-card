const key = "privaInnotech@";

const encrypt = (data) => Buffer.from(key + data).toString("base64");

const decrypt = (data) =>
  Buffer.from(data, "base64").toString("ascii").replace(key, "");

const decryptCardInfo = (Card) => {
  let { Fname, Lname, Tel } = Card;
  let deFname, deLname, deTel;
  Fname === null ? (deFname = "") : (deFname = decrypt(Fname));
  Lname === null ? (deLname = "") : (deLname = decrypt(Lname));
  Tel === null ? (deTel = "") : (deTel = decrypt(Tel));
  return { deFname, deLname, deTel };
};

module.exports = {
  encrypt,
  decrypt,
  decryptCardInfo,
};
