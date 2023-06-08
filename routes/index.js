const express = require('express');
const router = express.Router();
const { isCardAuth, isCard } = require('./middleware/checkCard');
const { ifNotLoggedIn, ifLoggedIn, isAuth } = require('./middleware/checkUser');

router.get('/', (req, res) => {
  res.render('index.ejs');
});

router.get('/privacy-policy', (req, res) => {
  res.render('privacy-policy');
});

router.get('/manage/:CardTag', isCardAuth, (req, res) => {
  res.render('card-edit.ejs');
});

router.get('/login', ifLoggedIn, (req, res) => {
  res.render('login.ejs');
});

router.get('/register', ifLoggedIn, (req, res) => {
  res.render('register.ejs');
});

router.get('/card_manager', ifNotLoggedIn, isAuth, (req, res) => {
  res.render('card-manager');
});

router.get('/test', (req, res) => {
  res.render('test');
});

module.exports = router;
