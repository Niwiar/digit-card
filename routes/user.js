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
        res.status(500).send({message: err});
    }
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    req.isAuth = false;
    res.redirect('/login');
})



module.exports = router