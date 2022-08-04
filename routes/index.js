const express = require('express');
const router = express.Router();
const { isCardAuth, isCard } = require('./middleware/checkCard');
const { ifNotLoggedIn, ifLoggedIn, isAuth } = require('./middleware/checkUser');

router.get('/', isCard, (req, res) => {
    res.render('index.ejs');
})

router.get('/privacy-policy', (req, res) => {
    res.render('policy')
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

router.get('/card_manager', (req, res) => {
    res.render('card-manager')
})

module.exports = router