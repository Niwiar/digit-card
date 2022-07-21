// require('dotenv').config();
// const {PORT, SQL_USER, SQL_PASSWORD, SQL_DATABASE, SQL_SERVER} = process.env

const dbconfig = {
    user: "admin",
    password: "admin",
    server: "localhost",
    database: "digitalCard",
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