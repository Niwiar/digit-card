const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const cors = require('cors');

const PORT = 3000

app.use(cors());

app.set('views', path.join(__dirname, "views"));
// app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(session({
    cookie: {
        maxAge: 1000 * 60 *60
    },
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));

// only in local
app.set('subdomain offset', 1);

let indexRoute = require('./routes/index');
let userRoute = require('./routes/user');
let cardRoute = require('./routes/card');

app.use('/', indexRoute);

app.use('/card', cardRoute);


app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});

