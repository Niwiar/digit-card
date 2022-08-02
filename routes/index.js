const express = require('express');
const router = express.Router();
const { isCardAuth, isCard } = require('./middleware/checkCard');
const { ifNotLoggedIn, ifLoggedIn, isAuth } = require('./middleware/checkUser');

router.get('/', isCard, async (req, res) => {
    res.render('index.ejs');
})

router.get('/manage/:CardTag', isCardAuth, (req, res) => {
    res.render('card-edit');
})

router.get('/login', ifLoggedIn, (req, res, next) => {
    res.render('login.ejs');
});

router.get('/register', ifLoggedIn, (req, res, next) => {
    res.render('register.ejs');
});

router.get('/card_manager', ifNotLoggedIn, (req, res) => {
    res.render('card-manager')
})

module.exports = router