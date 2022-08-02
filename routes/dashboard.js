const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const sql = require("mssql");
const { dbconfig } = require("../config");

const upload = require("./modules/uploadImage");
const { encrypt, decrypt } = require("./modules/encryption");

const checkCard = async (Id) => {
  let pool = await sql.connect(dbconfig);
  let CheckCard = await pool.request().query(`SELECT CASE
    WHEN EXISTS(
        SELECT * FROM Cards WHERE CardId = N'${Id}'
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`);
  return CheckCard.recordset[0].check;
};

router.get("/cardlist", async (req, res, next) => {
  try {
    let pool = await sql.connect(dbconfig);
    let Cards = await pool
      .request()
      .query(
        `SELECT row_number() over(order by CardId desc) as 'index', * FROM Cards`
      );
    for (let Card of Cards.recordset) {
      let { Fname, Lname, Tel } = Card;
      Card.Fname = decrypt(JSON.parse(Fname));
      Card.Lname = decrypt(JSON.parse(Lname));
      Card.Tel = decrypt(JSON.parse(Tel));
    }
    res.status(200).send(JSON.stringify(Cards.recordset));
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.get("/card_data/:CardId", async (req, res, next) => {
  try {
    let CardId = req.params.CardId;
    let pool = await sql.connect(dbconfig);
    let Card = await pool
      .request()
      .query(`SELECT * FROM Cards WHERE CardId = N'${CardId}'`);
    if (Card.recordset.length) {
      let { Fname, Lname, Tel } = Card.recordset[0];
      Card.recordset[0].Fname = decrypt(JSON.parse(Fname));
      Card.recordset[0].Lname = decrypt(JSON.parse(Lname));
      Card.recordset[0].Tel = decrypt(JSON.parse(Tel));
      res.status(200).send(JSON.stringify(Card.recordset[0]));
    } else {
      res.status(404).send({ message: "ไม่พบการ์ด" });
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.put("/card_edit/:CardId", async (req, res) => {
  try {
    let CardId = req.params.CardId;
    let { Fname, Lname, Company, Tel, Email, Facebook, Line } = req.body;
    let enFname = JSON.stringify(encrypt(Fname));
    let enLname = JSON.stringify(encrypt(Lname));
    let enTel = JSON.stringify(encrypt(Tel));
    let pool = await sql.connect(dbconfig);
    if (await checkCard(CardId)) {
      let UpdateCard = `UPDATE Cards
        SET
        Fname = N'${enFname}',
        Lname = N'${enLname}',
        Company = N'${Company}',
        Tel = N'${enTel}',
        Facebook = N'${Facebook}',
        Line = N'${Line}',
        Email = N'${Email}'
        WHERE CardTag = N'${CardTag}'`;
      await pool.request().query(UpdateCard);
      res.status(200).send({ message: `แก้ไขการ์ดสำเร็จ` });
    } else {
      res.status(404).send({ message: "ไม่พบการ์ด" });
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.post("/card_img_upload/:CardId", async (req, res) => {
  try {
    let CardId = req.params.CardId;
    let Card = await pool.request().query(`SELECT * FROM Cards WHERE CardId = N'${CardId}'`);
    req.session.CardTag = Card.recordset[0].CardTag
    upload(req, res, async (err) => {
      if (err) {
        res.status(500).send({ message: `${err}` });
      } else {
        img = "/imgs/profile/" + req.file.filename;
        let UpdateImagePath = `UPDATE Cards SET ImgPath = N'${img}' WHERE CardId = N'${CardId}'`;
        let pool = await sql.connect(dbconfig);
        await pool.request().query(UpdateImagePath);
        req.session.CardTag = null;
        res.status(200).send({ message: "อัปโหลดรูปภาพสำเร็จ" });
      }
    });
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.get("/card_publish/:CardId", async (req, res) => {
  try {
    let CardId = req.session.CardId;
    let pool = await sql.connect(dbconfig);
    if (await checkCard(CardId)) {
      let PublishCard = `UPDATE Cards
        SET Published = 1
        WHERE CardId = N'${CardId}'
        SELECT CardName FROM Cards
        WHERE CardId = N'${CardId}'`;
      let card = await pool.request().query(PublishCard);
      let CardName = card.recordset[0].CardName;
      res.status(200).send({
        message: `เผยแพร่การ์ดสำเร็จ`,
        link: `${CardName}.localhost:3000`,
      });
    } else {
      res.status(404).send({ message: "ไม่พบการ์ด" });
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.get("/card_unpublish/:CardId", async (req, res) => {
  try {
    let CardId = req.session.CardId;
    let pool = await sql.connect(dbconfig);
    if (await checkCard(CardId)) {
      let UnpublishCard = `UPDATE Cards
        SET Published = 0
        WHERE CardId = N'${CardId}'`;
      await pool.request().query(UnpublishCard);
      res.status(200).send({ message: `เลิกเผยแพร่การ์ดสำเร็จ` });
    } else {
      res.status(404).send({ message: "ไม่พบการ์ด" });
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.put("/card_change_password/:CardId", async (req, res) => {
  try {
    let CardId = req.session.CardId;
    let CardPass = req.body.CardPass;
    if (CardPass == "") {
      res.status(400).send({ message: "กรุณาใส่รหัสผ่านของการ์ด" });
      return;
    }
    let pool = await sql.connect(dbconfig);
    if (await checkCard(CardId)) {
      let Hashpass = await bcrypt.hash(CardPass, 12);
      let UpdateCard = `UPDATE Cards
        SET CardPass = N'${Hashpass}'
        WHERE CardId = N'${CardId}'`;
      await pool.request().query(UpdateCard);
      res.status(200).send({ message: "เปลี่ยนรหัสผ่านของการ์ดสำเร็จ" });
    } else {
      res.status(404).send({ message: "ไม่พบการ์ด" });
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.delete("/card_delete/:CardId", async (req, res) => {
  try {
    let CardId = req.params.CardId;
    let pool = await sql.connect(dbconfig);
    if (await checkCard(CardId)) {
      let DeleteCard = `DELETE FROM Users WHERE CardId = ${CardId}`;
      await pool.request().query(DeleteCard);
      res.status(200).send({ message: "ลบการ์ดสำเร็จ" });
    } else {
      res.status(404).send({ message: "ไม่พบการ์ด" });
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

module.exports = router;
