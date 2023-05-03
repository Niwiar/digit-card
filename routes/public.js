const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { dbconfig } = require('../config');
const isConsent = require('./middleware/checkCookie');
const { decryptCardInfo } = require('./modules/utils');

router.get('/', async (req, res, next) => {
  const domainName = req.hostname.split('.');
  let subdomain = req.hostname.split('.')[0];
  if (!domainName.length || subdomain === 'www')
    return res.status(404).send({ message: `ไม่พบนามบัตร` });
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
});

router.get('/card/show/:CardName', async (req, res, next) => {
  try {
    let CardName = req.params.CardName;
    let pool = await sql.connect(dbconfig);
    let Card = await pool.request().query(
      `SELECT CardName, ImgPath, Fname, Lname,
        Company, Tel, Email, Facebook, Line
      FROM Cards WHERE CardName = N'${CardName}'`
    );
    if (Card.recordset.length) {
      let { deFname, deLname, deTel } = decryptCardInfo(Card.recordset[0]);
      Card.recordset[0].Fname = deFname;
      Card.recordset[0].Lname = deLname;
      Card.recordset[0].Tel = deTel;
      res.status(200).send(JSON.stringify(Card.recordset[0]));
    } else {
      res.status(404).send({ message: 'ไม่พบนามบัตร' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: `${err}` });
  }
});

router.get('/get', isConsent, (req, res) => {
  let cookies = req.cookies;
  res.send({ message: cookies.cc_cookie });
});

module.exports = router;
