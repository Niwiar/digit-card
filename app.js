const express = require('express');
const app = express();
const vhost = require('vhost');
const { cardApp } = require('./app/cardApp');
const { webApp } = require('./app/webApp');

const PORT = 4000;

// only in local
app.set('subdomain offset', 1);

app.use(vhost('*.*', cardApp));

app.use(vhost('*', webApp));

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
