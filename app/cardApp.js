const express = require('express');
const cardApp = express();
const morgan = require('morgan');
const path = require('path');
const flash = require('express-flash');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const cwd = process.cwd();

cardApp.use(cors());

cardApp.set('views', path.join(cwd, 'views'));
cardApp.engine('html', require('ejs').renderFile);
cardApp.set('view engine', 'html');

cardApp.use(express.static(path.join(cwd, 'assets')));
cardApp.use(express.static(path.join(cwd, 'public')));
cardApp.use(express.static(path.join(cwd, 'script')));

cardApp.use(morgan('dev'));
cardApp.use(express.json());
cardApp.use(express.urlencoded({ extended: false }));

cardApp.use(flash());

cardApp.use(cookieParser());
cardApp.use(
  cookieSession({
    name: 'pv_card_session',
    keys: ['priva, shownamecard'],
    maxAge: 1000 * 60 * 60 * 24,
  })
);

let publicRoute = require('../routes/public');

cardApp.use('/', publicRoute);

module.exports = { cardApp };
