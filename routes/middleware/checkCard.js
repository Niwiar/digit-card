const sql = require('mssql');
const { dbconfig } = require('../../config');

const isCard = async (req, res, next) => {
  //   console.log(req.subdomains);
  let subdomain = req.subdomains.slice(-1)[0];
  if (!req.subdomains.length || subdomain === 'www') return next();
  try {
    let pool = await sql.connect(dbconfig);
    let CheckCard = await pool.request().query(`SELECT CASE
        WHEN EXISTS(
            SELECT *
            FROM Cards
            WHERE CardName = N'${subdomain}' AND Published = 1
        )
        THEN CAST (1 AS BIT)
        ELSE CAST (0 AS BIT) END AS 'check'`);
    if (CheckCard.recordset[0].check) {
      res.render('card');
    } else {
      req.flash('error', 'ไม่พบนามบัตร');
      res.render('error.ejs');
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
};

const isCardAuth = async (req, res, next) => {
  if (!req.session.isCardAuth) {
    req.flash('error', 'ไม่พบนามบัตรหรือคุณไม่ได้รับอนุญาตให้เข้าสู่หน้านี้');
    return res.status(401).render('error.ejs');
  }
  try {
    let { CardTag } = req.params;
    let pool = await sql.connect(dbconfig);
    let Card = await pool.request().query(`SELECT CASE
        WHEN EXISTS(
            SELECT * FROM Cards WHERE CardTag = N'${CardTag}'
        )
        THEN CAST (1 AS BIT)
        ELSE CAST (0 AS BIT) END AS 'check'`);
    if (!Card.recordset[0].check) {
      req.flash('error', 'ไม่พบนามบัตรหรือคุณไม่ได้รับอนุญาตให้เข้าสู่หน้านี้');
      return res.status(401).render('error.ejs');
    }
    if (CardTag !== req.session.CardTag) {
      req.flash('error', 'ไม่พบนามบัตรหรือคุณไม่ได้รับอนุญาตให้เข้าสู่หน้านี้');
      return res.status(401).render('error.ejs');
    }
    next();
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
};

module.exports = {
  isCardAuth,
  isCard,
};
