// require('dotenv').config();
// const {PORT, SQL_USER, SQL_PASSWORD, SQL_DATABASE, SQL_SERVER} = process.env

const dbconfig = {
  // user: "sa",
  // password: "P@ssw0rd",
  // server: "192.168.1.6",
  // database: "Digital-Card",
  user: 'privainn_digitcard',
  password: 'X0m3he4%',
  server: '119.59.96.61',
  database: 'privainn_digitcard',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    trustedConnection: true,
  },
};

module.exports = {
  // PORT,
  dbconfig,
};
