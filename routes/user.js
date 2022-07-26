const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const sql = require('mssql');
const { dbconfig } = require('../config');

router.post('/login', async (req, res) => {
    try {
        let { Username, Password } = req.body;
        let pool = await sql.connect(dbconfig);
        let user = await pool.request().query(`SELECT * FROM Users WHERE Username = N'${Username}'`);
        if (user.recordset.length) {
            let compared = await bcrypt.compare(Password, user.recordset[0].Password)
            if (compared) {
                req.session.isLoggedIn = true;
                req.session.UserId = user.recordset[0].UserId;
                if(user.recordset[0].Authority == 1){
                    req.session.isAuth = true;
                } else{
                    req.session.isAuth = false;
                }
                res.redirect('/');
            } else {
                req.flash('login', 'Invalid Email or Password')
                res.redirect('/login')
            }
        } else {
            req.flash('login', 'Invalid Email or Password')
            res.redirect('/login')
        }
    } catch (err){
        res.status(500).send({message: `${err}`});
    }
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    req.isAuth = false;
    res.redirect('/login');
})

router.post('/register', async (req, res) => {
    try {
        let { Username, Password } = req.body;
        if (Username == '' || Password == '') {
            res.status(400).send({message: "Please enter username and password"});
            return;
        }
        let pool = await sql.connect(dbconfig);
        let CheckUser = await pool.request().query(`SELECT CASE
            WHEN EXISTS(
                SELECT * FROM Users
                WHERE Username = N'${Username}'
            )
            THEN CAST (1 AS BIT)
            ELSE CAST (0 AS BIT) END AS 'check'`);
        if (CheckUser.recordset[0].check) {
            req.flash('register', 'Duplicate Username')
            res.redirect('/register')
        } else {
            let Hashpass = await bcrypt.hash(Password, 12)
            let InsertUser = `INSERT INTO Users(Username, Password)
                VALUES  (N'${Username}', N'${Hashpass}')`;
            await pool.request().query(InsertUser);
            res.status(201).send({message: 'Register successfully, Now you can login'});
        }
    } catch (err){
        res.status(500).send({message: `${err}`});
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