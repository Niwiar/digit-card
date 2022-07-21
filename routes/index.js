const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { dbconfig } = require('../config');

const isSub = (req, res, next) => {
    if (!req.subdomains.length || req.subdomains.slice(-1)[0] === 'www') return next();
    let subdomain = req.subdomains.slice(-1)[0];
    // keep subdomain
    req.subdomain = subdomain;
    next();
}

const isCard = (req, res, next) => {
    if (!req.subdomains.length || req.subdomains.slice(-1)[0] === 'www') return next();
    let subdomain = req.subdomains.slice(-1)[0];
    // keep subdomain
    req.subdomain = subdomain;
    next();
}

router.get('/', isSub, async (req, res) => {
    if (!req.subdomain) {
        res.render('index');
    } else {
        let pool = await sql.connect(dbconfig);
        let CheckCard = await pool.request().query(`SELECT CASE
        WHEN EXISTS(
            SELECT *
            FROM Cards
            WHERE CardName = N'${req.subdomain}' AND Published = 1
        )
        THEN CAST (1 AS BIT)
        ELSE CAST (0 AS BIT) END AS 'check'`);
        if(!CheckCard.recordset[0].check){
            res.render('notfound');
        } else {
            res.render('card');
        }
    }
})

router.get('/edit', isSub, async (req, res) => {
    if (!req.subdomain) {
        res.render('card-template')
    } else {
        let pool = await sql.connect(dbconfig);
        let CheckCard = await pool.request().query(`SELECT CASE
        WHEN EXISTS(
            SELECT *
            FROM Cards
            WHERE CardName = N'${req.subdomain}'
        )
        THEN CAST (1 AS BIT)
        ELSE CAST (0 AS BIT) END AS 'check'`);
        if(!CheckCard.recordset[0].check){
            res.render('notfound');
        } else {
            res.render('card-edit');
        }
    }
})

router.get('/error', (req, res) => {
    res.render('notfound');
})

module.exports = router