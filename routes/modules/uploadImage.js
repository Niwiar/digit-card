const multer = require('multer');
const path = require('path');
const sql = require('mssql');
const { dbconfig } = require('../../config');

const profileStorage = multer.diskStorage({
  destination: path.join(__dirname, '../../public/imgs/profile'),
  filename: async (req, file, cb) => {
    let CardTag = req.session.CardTag;
    let pool = await sql.connect(dbconfig);
    let card = await pool
      .request()
      .query(`SELECT CardName name FROM Cards WHERE CardTag = N'${CardTag}'`);
    let cardname = card.recordset[0].name;
    const ext = file.mimetype.split('/')[1];
    cb(null, 'img_' + cardname + '.' + ext);
  },
});

const uploadProfile = multer({ storage: profileStorage }).single('profile');

const logoStorage = multer.diskStorage({
  destination: path.join(__dirname, '../../public/imgs/logo'),
  filename: async (req, file, cb) => {
    let CardTag = req.session.CardTag;
    let pool = await sql.connect(dbconfig);
    let card = await pool
      .request()
      .query(`SELECT CardName name FROM Cards WHERE CardTag = N'${CardTag}'`);
    let cardname = card.recordset[0].name;
    const ext = file.mimetype.split('/')[1];
    cb(null, 'logo_' + cardname + '.' + ext);
  },
});

const uploadLogo = multer({ storage: logoStorage }).single('logo');

module.exports = {
  uploadLogo,
  uploadProfile,
};
