const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const sql = require("mssql");
const { dbconfig } = require("../config");

const upload = require('./modules/uploadImage');
const { encrypt, decrypt } = require('./modules/encryption');

const checkCard = async (Tag) => {
  let pool = await sql.connect(dbconfig);
  let CheckCard = await pool.request().query(`SELECT CASE
        WHEN EXISTS(
            SELECT * FROM Cards WHERE CardTag = N'${Tag}'
        )
        THEN CAST (1 AS BIT)
        ELSE CAST (0 AS BIT) END AS 'check'`);
  return CheckCard.recordset[0].check;
}

router.get("/data/:CardName", async (req, res, next) => {
  try {
    let CardName = req.params.CardName;
    let pool = await sql.connect(dbconfig);
    let Card = await pool
      .request()
      .query(`SELECT * FROM Cards WHERE CardName = N'${CardName}'`);
    if (Card.recordset.length) {
      let { Fname, Lname, Tel } = Card.recordset[0]
      Card.recordset[0].Fname = decrypt(JSON.parse(Fname))
      Card.recordset[0].Lname = decrypt(JSON.parse(Lname))
      Card.recordset[0].Tel = decrypt(JSON.parse(Tel))
      res.status(200).send(JSON.stringify(Card.recordset[0]));
    } else {
      res.status(404).send({ message: "Card not found" });
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

// authorization to access card editor
router.post("/auth", async (req, res) => {
  try {
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
        req.flash("error", "Invalid card password");
        res.render("error.ejs");
      }
    } else {
      req.flash("error", "Card not found");
      res.render("error.ejs");
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.post("/create", async (req, res, next) => {
  try {
    let { CardName, CardPass } = req.body;
    if (CardName == "" || CardPass == "") {
      res.status(400).send({ message: "Please fill Card name and password" });
      return;
    }
    let pool = await sql.connect(dbconfig);
    let CheckCard = await pool.request().query(`SELECT *
            FROM Cards
            WHERE CardName = N'${CardName}'`);
    if (CheckCard.recordset.length) {
      res.status(400).send({ message: "Duplicate Card" });
    } else {
      let Hashpass = await bcrypt.hash(CardPass, 12);
      let Hashtag = await bcrypt.hash(CardName, 5);
      Hashtag = Hashtag.replace(/\//g, "");
      let InsertCard = `INSERT INTO Cards(CardName, CardTag, CardPass)
        VALUES (N'${CardName}', N'${Hashtag}', N'${Hashpass}')`;
      await pool.request().query(InsertCard);
      res.status(201).send({ message: "Successfully create Card" });
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});


router.put("/edit", async (req, res) => {
  try {
    let CardTag = req.session.CardTag;
    console.log(req.session)
    let { Fname, Lname, Company, Tel, Email, Facebook, Line } = req.body;
    let enFname = JSON.stringify(encrypt(Fname));
    console.log(enFname)
    let enLname = JSON.stringify(encrypt(Lname));
    let enTel = JSON.stringify(encrypt(Tel));
    let pool = await sql.connect(dbconfig);
    if (await checkCard(CardTag)) {
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
      res.status(200).send({ message: `Successfully edit Card` });
    } else {
      res.status(404).send({ message: "Card not found" });
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.put("/upload", async (req, res) => {
  let CardTag = req.session.CardTag;
  upload(req, res, async (err) => {
    if (err){
      res.status(500).send({ message: `${err}` });
    } else{
        try{
            img = "/imgs/profile/" + req.file.filename;
            let UpdateImagePath = `UPDATE Cards SET ImgPath = N'${img}' WHERE CardTag = ${CardTag}`;
            await pool.request().query(UpdateImagePath);
            res.status(200).send({message: 'Successfully upload image'});
        } catch(err){
            res.status(500).send({ message: `${err}` });
        }
    }
    })
})

router.get("/publish", async (req, res) => {
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
      res.status(200).send({
        message: `Your Digital Card is Ready`,
        link: `${CardName}.localhost:3000`,
      });
    } else {
      res.status(404).send({ message: "Card not found" });
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.get("/unpublish", async (req, res) => {
  try {
    let CardTag = req.session.CardTag;
    let pool = await sql.connect(dbconfig);
    if (await checkCard(CardTag)) {
      let UnpublishCard = `UPDATE Cards
        SET Published = 0
        WHERE CardTag = N'${CardTag}'`;
      await pool.request().query(UnpublishCard);
      res.status(200).send({ message: `Your Digital Card has been unpublish` });
    } else {
      res.status(404).send({ message: "Card not found" });
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.put("/change_password", async (req, res) => {
  try {
    let CardTag = req.session.CardTag;
    let CardPass = req.body.CardPass;
    if (CardPass == "") {
      res.status(400).send({ message: "Please enter card's password" });
      return;
    }
    let pool = await sql.connect(dbconfig);
    if (await checkCard(CardTag)) {
      let Hashpass = await bcrypt.hash(CardPass, 12);
      let UpdateCard = `UPDATE Cards
        SET CardPass = N'${Hashpass}'
        WHERE CardTag = N'${CardTag}'`;
      await pool.request().query(UpdateCard);
      res.status(200).send({ message: "Successfully change card's password" });
    } else {
      res.status(404).send({ message: "Card not found" });
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    let CardTag = req.params.CardTag;
    let pool = await sql.connect(dbconfig);
    if (await checkCard(CardTag)) {
      let DeleteCard = `DELETE FROM Users WHERE CardTag = ${CardTag}`;
      await pool.request().query(DeleteCard);
      res.status(200).send({ message: "Successfully delete card" });
    } else {
      res.status(404).send({ message: "Card not found" });
    }
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
});

module.exports = router;
