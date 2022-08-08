const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const flash = require('express-flash');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser')
const cors = require('cors');

const PORT = 4000

app.use(cors());

app.set('views', path.join(__dirname, "views"));
// app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')

app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'script')));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(flash());

app.use(cookieParser());
app.use(cookieSession({
    name: 'pv_session',
    keys: ['key1, key2'],
    maxAge: 1000 * 60 * 60 * 24
}))

// only in local
app.set('subdomain offset', 1);

let indexRoute = require('./routes/index');
let userRoute = require('./routes/user');
let cookieRoute = require('./routes/cookie');

let cardRoute = require('./routes/card');
let dashboardRoute = require('./routes/dashboard');

app.use((req, res, next) => {
    let cookies = req.cookies;
    if (cookies.cc_cookie !== "consented" || cookies.cc_cookie !== "withdrawed") {
        res.cookie('cc_cookie', 'nonconsented', { maxAge: 180*24*60*60*1000, httpOnly: true });
    }
    next()
})

app.use('/', indexRoute);
app.use('/user', userRoute);
app.use('/cookie', cookieRoute);

app.use('/card', cardRoute);
app.use('/dashboard', dashboardRoute);

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});

