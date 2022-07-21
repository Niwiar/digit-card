const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const sql = require('mssql');
const { dbconfig } = require('../config');

router.get('/list', async (req, res, next) => {
    try{
        let SelectCard = `SELECT row_number() over(order by CardId) as 'index', * FROM Cards ORDER BY CardId`;
        let pool = await sql.connect(dbconfig);
        let Card = await pool.request().query(SelectCard);
        res.status(200).send(JSON.stringify(Card.recordset));
    } catch(err){
        res.status(500).send({message: err});
    }
})

router.get('/:CardTag', async (req, res, next) => {
    try{
        let CardTag = req.params.CardTag;
        let CardPass = req.body.CardPass;
        let pool = await sql.connect(dbconfig);
        let Card = await pool.request().query(`SELECT * FROM Cards WHERE CardTag = N'${CardTag}'`);
        if (Card.recordset.length) {
            let compared = await bcrypt.compare(CardPass, user.recordset[0].CardPass)
            if (compared) {
                res.status(200).send(JSON.stringify(Card.recordset[0]));
            } else {
                res.status(403).send({message: 'Invalid card password'});
            }
        } else {
            res.status(404).send({message: 'Card not found'});
        }
    } catch(err){
        res.status(500).send({message: err});
    }
})

router.post('/add', async (req, res, next) => {
    try{
        let { CardName, CardPass} = req.body;
        if (CardName == '' || CardPass == '') {
            res.status(400).send({message: "Please fill Card name and password"});
            return;
        }
        let pool = await sql.connect(dbconfig);
        let CheckCard = await pool.request().query(`SELECT *
            FROM Cards
            WHERE CardName = N'${CardName}'`);
        if(!CheckCard.recordset.length) {
            let Hashpass = await bcrypt.hash(CardPass, 12)
            let Hashtag = await bcrypt.hash(CardName, 5)
            let InsertCard = `INSERT INTO Cards(CardName, CardTag, CardPass)
                VALUES (N'${CardName}', N'${Hashtag}', N'${Hashpass}')`;
            await pool.request().query(InsertCard);
            res.status(201).send({message: 'Successfully add Card'});
        } else {
            res.status(400).send({message: 'Duplicate Card'});
        }
    } catch(err){
        res.status(500).send({message: err});
    }
})

router.put('/edit/:CardTag', async (req, res) => {
    try{
        let CardTag = req.params.CardTag;
        let { Title, Fname, Lname, Position , Tel, Email } = req.body
        let pool = await sql.connect(dbconfig);
        let UpdateCard = `UPDATE Cards
            SET
            Title = N'${Title}',
            Fname = N'${Fname}',
            Lname = N'${Lname}',
            Position = N'${Position}',
            Tel = N'${Tel}',
            Email = N'${Email}'
            WHERE CardTag = N'${CardTag}'`;
        await pool.request().query(UpdateCard);
        res.status(200).send({message: `Successfully edit Card`});
    } catch(err){
        res.status(500).send({message: `${err}`});
    }
})

router.get('/publish/:CardName', async (req, res) => {
    try{
        let CardName = req.params.CardName;
        let pool = await sql.connect(dbconfig);
        let PublishCard = `UPDATE Cards
            SET Published = 1
            WHERE CardName = ${CardName}`;
        await pool.request().query(PublishCard);
        res.status(200).send({message: `Your Digital Card is Ready`, link: `${CardName}.localhost:3000`});
    } catch(err){
        res.status(500).send({message: `${err}`});
    }
})

router.put('/change_password/:CardTag', async (req, res) => {
    try{
        let CardTag = req.params.CardTag;
        let CardPass = req.body.CardPass
        if (CardPass == '') {
            res.status(400).send({message: "Please enter card's password"});
            return;
        }
        let pool = await sql.connect(dbconfig);
        let Hashpass = await bcrypt.hash(CardPass, 12)
        let UpdateCard = `UPDATE Cards
            SET CardPass = N'${Hashpass}'
            WHERE CardTag = ${CardTag}`;
        await pool.request().query(UpdateCard);
        res.status(200).send({message: "Successfully change card's password"});
    } catch(err){
        res.status(500).send({message: `${err}`});
    }
})

router.delete('/delete/:CardTag', async (req, res) => {
    try{
        let CardTag = req.params.CardTag;
        let pool = await sql.connect(dbconfig);
        let DeleteCard = `DELETE FROM Users WHERE CardTag = ${CardTag}`;
        await pool.request().query(DeleteCard);
        res.status(200).send({message: 'Successfully delete card'});
    } catch(err){
        res.status(500).send({message : `${err}`});
    }
})

module.exports = router