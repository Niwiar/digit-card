const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const sql = require('mssql');
const { dbconfig } = require('../config');

const upload = require('./modules/uploadImage');
const { encrypt, decryptCardInfo } = require('./modules/utils');

const QRCode = require('qrcode');

const checkCard = async (Tag) => {
  let pool = await sql.connect(dbconfig);
  let CheckCard = await pool.request().query(`SELECT CASE
        WHEN EXISTS(
            SELECT * FROM Cards WHERE CardTag = N'${Tag}'
        )
        THEN CAST (1 AS BIT)
        ELSE CAST (0 AS BIT) END AS 'check'`);
  return CheckCard.recordset[0].check;
};

const checkSpecial = (word) => {
  // var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  // return format.test(word);
  return word.match(/^[^a-zA-Z0-9]+$/);
};

router.get('/data', async (req, res, next) => {
  try {
    let CardTag = req.session.CardTag;
    let pool = await sql.connect(dbconfig);
    let Card = await pool.request().query(
      `SELECT CardName, ImgPath, Fname, Lname,
        Company, Tel, Email, Facebook, Line, Published
      FROM Cards WHERE CardTag = N'${CardTag}'`
    );
    if (Card.recordset.length) {
      let { CardName } = Card.recordset[0];
      let { deFname, deLname, deTel } = decryptCardInfo(Card.recordset[0]);
      Card.recordset[0].Fname = deFname;
      Card.recordset[0].Lname = deLname;
      Card.recordset[0].Tel = deTel;
      Card.recordset[0].Link = `${CardName}.localhost:3000`;
      res.status(200).send(JSON.stringify(Card.recordset[0]));
    } else {
      res.status(404).send({ message: 'ไม่พบนามบัตร' });
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.get('/show/:CardName', async (req, res, next) => {
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

// authorization to access card editor
router.post('/auth', async (req, res) => {
  try {
    let cookies = req.cookies;
    if (cookies.cc_cookie !== 'consented') {
      req.flash('auth', 'กรุณายินยอมการใช้งานคุกกี้และการเก็บข้อมูลส่วนบุคคล');
      res.render('index.ejs');
      return;
    }
    let { CardName, CardPass } = req.body;
    let pool = await sql.connect(dbconfig);
    let Card = await pool
      .request()
      .query(`SELECT * FROM Cards WHERE CardName = N'${CardName}'`);
    if (Card.recordset.length) {
      let compared = await bcrypt.compare(CardPass, Card.recordset[0].CardPass);
      if (compared) {
        req.session.isCardAuth = true;
        req.session.CardTag = Card.recordset[0].CardTag;
        res.redirect(`/manage/${Card.recordset[0].CardTag}`);
      } else {
        req.flash('auth', 'รหัสผ่านของนามบัตรไม่ถูกต้อง');
        res.render('index.ejs');
      }
    } else {
      req.flash('auth', 'ไม่พบนามบัตร');
      res.render('index.ejs');
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.post('/create', async (req, res, next) => {
  try {
    let cookies = req.cookies;
    if (cookies.cc_cookie !== 'consented') {
      req.flash(
        'createErr',
        'กรุณายินยอมการใช้งานคุกกี้และการเก็บข้อมูลส่วนบุคคลเพื่อเข้าใช้งาน'
      );
      return res.render('index.ejs');
    }
    let { CardName, CardPass } = req.body;
    if (CardName == '' || CardPass == '') {
      req.flash('createErr', 'กรุณาใส่ชื่อนามบัตรและรหัสผ่านในช่องว่าง');
      return res.render('index.ejs');
      // res.status(400).send({ message: "กรุณาใส่ชื่อนามบัตรและรหัสผ่านในช่องว่าง" });
    }
    if (checkSpecial(CardName)) {
      req.flash(
        'createErr',
        'ตั้งชื่อนามบัตรด้วยตัวอักษรภาษาอังกฤษหรือตัวเลขเท่านั้น'
      );
      return res.render('index.ejs');
      // res.status(400).send({ message: "กรุณาอย่าใช้ . หรือ ' ในชื่อนามบัตร" });
    }
    let pool = await sql.connect(dbconfig);
    let CheckCard = await pool.request().query(`SELECT *
      FROM Cards WHERE CardName = N'${CardName}'`);
    if (CheckCard.recordset.length) {
      req.flash('createErr', 'ชื่อนามบัตรซ้ำ');
      return res.render('index.ejs');
      // res.status(400).send({ message: "ชื่อนามบัตรซ้ำ" });
    }
    let Hashpass = await bcrypt.hash(CardPass, 12);
    let Hashtag = await bcrypt.hash(CardName, 5);
    Hashtag = Hashtag.replace(/\//g, '');
    let InsertCard = `INSERT INTO Cards(CardName, CardTag, CardPass)
        VALUES (N'${CardName}', N'${Hashtag}', N'${Hashpass}')`;
    await pool.request().query(InsertCard);
    req.flash('success', 'สร้างนามบัตรสำเร็จ');
    res.render('index.ejs');
    // res.status(201).send({ message: "สร้างนามบัตรสำเร็จ" });
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.put('/edit', async (req, res) => {
  try {
    let CardTag = req.session.CardTag;
    let { Fname, Lname, Company, Tel, Email, Facebook, Line } = req.body;
    let enFname = encrypt(Fname);
    let enLname = encrypt(Lname);
    let enTel = encrypt(Tel);
    console.log(enFname.toString());
    console.log(enLname.toString());
    console.log(enTel.toString());
    let pool = await sql.connect(dbconfig);
    if (await checkCard(CardTag)) {
      let UpdateCard = `UPDATE Cards
        SET
        Fname = N'${enFname}', Lname = N'${enLname}',
        Company = N'${Company}', Tel = N'${enTel}',
        Facebook = N'${Facebook}', Line = N'${Line}',
        Email = N'${Email}'
        WHERE CardTag = N'${CardTag}'`;
      await pool.request().query(UpdateCard);
      res.status(200).send({ message: `แก้ไขนามบัตรสำเร็จ` });
    } else {
      res.status(404).send({ message: 'ไม่พบนามบัตร' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: `${err}` });
  }
});

router.post('/upload', async (req, res) => {
  try {
    let CardTag = req.session.CardTag;
    upload(req, res, async (err) => {
      if (err) {
        res.status(500).send({ message: `${err}` });
      } else {
        img = '/imgs/profile/' + req.file.filename;
        let UpdateImagePath = `UPDATE Cards SET ImgPath = N'${img}'
          WHERE CardTag = N'${CardTag}'`;
        let pool = await sql.connect(dbconfig);
        await pool.request().query(UpdateImagePath);
        res.status(200).send({ message: 'อัปโหลดรูปภาพสำเร็จ' });
      }
    });
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.get('/publish', async (req, res) => {
  try {
    let CardTag = req.session.CardTag;
    let pool = await sql.connect(dbconfig);
    if (await checkCard(CardTag)) {
      let PublishCard = `UPDATE Cards
        SET Published = 1
        WHERE CardTag = N'${CardTag}'
        SELECT CardName FROM Cards
        WHERE CardTag = N'${CardTag}'`;
      let card = await pool.request().query(PublishCard);
      let CardName = card.recordset[0].CardName;
      let CardLink = `${CardName}.localhost:4000`;
      await QRCode.toDataURL(
        CardLink,
        {
          errorCorrectionLevel: 'H',
          version: 4,
          margin: 1,
        },
        (err, CardQr) => {
          if (err) {
            console.log(err);
            res.status(500).send({ message: `${err}` });
          }
          console.log(CardLink);
          console.log(CardQr);
          res.status(200).send({
            message: `เผยแพร่นามบัตรสำเร็จ`,
            link: CardLink,
            qrData: CardQr,
          });
        }
      );
    } else {
      res.status(404).send({ message: 'ไม่พบนามบัตร' });
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.get('/unpublish', async (req, res) => {
  try {
    let CardTag = req.session.CardTag;
    let pool = await sql.connect(dbconfig);
    if (await checkCard(CardTag)) {
      let UnpublishCard = `UPDATE Cards
        SET Published = 0
        WHERE CardTag = N'${CardTag}'`;
      await pool.request().query(UnpublishCard);
      res.status(200).send({ message: `เลิกเผยแพร่นามบัตรสำเร็จ` });
    } else {
      res.status(404).send({ message: 'ไม่พบนามบัตร' });
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.put('/change_password', async (req, res) => {
  try {
    let CardTag = req.session.CardTag;
    let CardPass = req.body.CardPass;
    if (CardPass == '') {
      res.status(400).send({ message: 'กรุณาใส่รหัสผ่านของนามบัตร' });
      return;
    }
    let pool = await sql.connect(dbconfig);
    if (await checkCard(CardTag)) {
      let Hashpass = await bcrypt.hash(CardPass, 12);
      let UpdateCard = `UPDATE Cards
        SET CardPass = N'${Hashpass}'
        WHERE CardTag = N'${CardTag}'`;
      await pool.request().query(UpdateCard);
      res.status(200).send({ message: 'เปลี่ยนรหัสผ่านของนามบัตรสำเร็จ' });
    } else {
      res.status(404).send({ message: 'ไม่พบนามบัตร' });
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.delete('/delete', async (req, res) => {
  try {
    let CardTag = req.params.CardTag;
    let pool = await sql.connect(dbconfig);
    if (await checkCard(CardTag)) {
      let DeleteCard = `DELETE FROM Users WHERE CardTag = ${CardTag}`;
      await pool.request().query(DeleteCard);
      res.status(200).send({ message: 'ลบนามบัตรสำเร็จ' });
    } else {
      res.status(404).send({ message: 'ไม่พบนามบัตร' });
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

module.exports = router;
