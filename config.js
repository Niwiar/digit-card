// require('dotenv').config();
// const {PORT, SQL_USER, SQL_PASSWORD, SQL_DATABASE, SQL_SERVER} = process.env

const dbconfig = {
    user: "sa",
    password: "P@ssw0rd",
    server: "192.168.1.5",
    database: "Digital-Card",
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        trustedConnection: true
    }
}

module.exports = {
    // PORT,
    dbconfig
}