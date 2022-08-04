const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const sql = require('mssql');
const { dbconfig } = require('../config');

router.post('/login', async (req, res) => {
    try {
        let { CardName, CardPass } = req.body;
        let pool = await sql.connect(dbconfig);
        let User = await pool.request().query(`SELECT * FROM Cards WHERE CardName = N'${CardName}' AND Authority = 1`);
        if (User.recordset.length) {
            let compared = await bcrypt.compare(CardPass, User.recordset[0].CardPass)
            if (compared) {
                req.session.isLoggedIn = true;
                req.session.UserId = User.recordset[0].CardId;
                req.session.isAuth = true;
                res.redirect('/');
            } else {
                req.flash('login', 'Invalid Username or Password')
                res.redirect('/login')
            }
        } else {
            req.flash('login', 'Invalid Username or Password')
            res.redirect('/login')
        }
    } catch (err){
        res.status(500).send({message: `${err}`});
    }
});

router.get('/logout', (req, res, next) => {
    req.session = null;
    req.isAuth = false;
    res.redirect('/login');
})

router.post('/register', async (req, res) => {
    try {
        let { CardName, CardPass } = req.body;
        if (CardName == '' || CardPass == '') {
            res.status(400).send({message: "Please enter Username and Password"});
            return;
        }
        let pool = await sql.connect(dbconfig);
        let CheckUser = await pool.request().query(`SELECT CASE
            WHEN EXISTS(
                SELECT * FROM Cards
                WHERE CardName = N'${CardName}'
            )
            THEN CAST (1 AS BIT)
            ELSE CAST (0 AS BIT) END AS 'check'`);
        if (CheckUser.recordset[0].check) {
            req.flash('register', 'Duplicate Username')
            res.redirect('/register')
        } else {
            let Hashpass = await bcrypt.hash(CardPass, 12)
            let InsertUser = `INSERT INTO Cards(CardName, CardPass, Authority)
                VALUES  (N'${CardName}', N'${Hashpass}', 1)`;
            await pool.request().query(InsertUser);
            // res.status(201).send({message: 'Register successfully, Now you can login'});
            req.flash('success', 'Register successfully, Now you can login')
            res.redirect('/register')
        }
    } catch (err){
        // res.status(500).send({message: `${err}`});
        req.flash('error', `${err}`)
        res.redirect('/register')
    }
});

router.put('/edit/:UserId', async (req, res) => {
    try {
        let { UserId } = req.params;
        let { Password } = req.body;
        if (Password == '') {
            res.status(400).send({message: "Please enter password"});
            return;
        }
        let pool = await sql.connect(dbconfig);
        let CheckUser = await pool.request().query(`SELECT CASE
            WHEN EXISTS(
                SELECT * FROM Users
                WHERE UserId = ${UserId}
            )
            THEN CAST (1 AS BIT)
            ELSE CAST (0 AS BIT) END AS 'check'`);
        if (CheckUser.recordset[0].check) {
            let Hashpass = await bcrypt.hash(Password, 12)
            let UpdateUser = `UPDATE Users
                SET Password = N'${Hashpass}'
                WHERE UserId = ${UserId}`;
            await pool.request().query(UpdateUser);
            req.flash('success', 'User has been edited')
            res.redirect('/user')
        } else {
            req.flash('edit', 'User not found')
            res.redirect('/user')
        }
    } catch (err){
        res.status(500).send({message: `${err}`});
    }
});

module.exports = router