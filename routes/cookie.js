const express = require('express');
const router = express.Router();

const isConsent = require('./middleware/checkCookie');

const cookieExpireDays = 180;

router.get('/get', isConsent, (req, res) => {
  let cookies = req.cookies;
  res.send({ message: cookies.cc_cookie });
});

router.get('/consent', (req, res) => {
  res.cookie('cc_cookie', 'consented', {
    maxAge: cookieExpireDays * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  // ใช้ในการบันทึกการยินยอมของผู้ใช้ในการใช้งานคุกกี้และข้อมูลส่วนบุคคลในการดำเนินงานของเว็บไซต์
  res.send({ message: 'consent success' });
});

router.get('/withdraw', (req, res) => {
  res.cookie('cc_cookie', 'withdrawed', {
    maxAge: cookieExpireDays * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  res.send({ message: 'withdraw success' });
});

module.exports = router;
