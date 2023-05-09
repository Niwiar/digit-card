const express = require('express');
const webApp = express();
const morgan = require('morgan');
const path = require('path');
const flash = require('express-flash');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const PORT = 4002;
const cwd = process.cwd();

webApp.use(cors());

webApp.set('views', path.join(cwd, 'views'));
webApp.engine('html', require('ejs').renderFile);
webApp.set('view engine', 'html');

webApp.use(express.static(path.join(cwd, 'assets')));
webApp.use(express.static(path.join(cwd, 'public')));
webApp.use(express.static(path.join(cwd, 'script')));

webApp.use(morgan('dev'));
webApp.use(express.json());
webApp.use(express.urlencoded({ extended: false }));

webApp.use(flash());

webApp.use(cookieParser());
webApp.use(
  cookieSession({
    name: 'pv_session',
    keys: ['priva, digitalnamecard'],
    maxAge: 1000 * 60 * 60 * 24,
  })
);

let indexRoute = require('../routes/index');
let userRoute = require('../routes/user');
let cookieRoute = require('../routes/cookie');

let cardRoute = require('../routes/card');
let dashboardRoute = require('../routes/dashboard');

webApp.use('/', indexRoute);
webApp.use('/user', userRoute);
webApp.use('/cookie', cookieRoute);

webApp.use('/card', cardRoute);
webApp.use('/dashboard', dashboardRoute);

webApp.listen(PORT, () => {
  console.log(`Web server is listening on ${PORT}`);
});
