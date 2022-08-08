const express = require('express');
const router = express.Router();

const cookieExpireDays = 0.5;

router.get('/get', (req, res) => {
    let cookies = req.cookies;
    res.send({ message: cookies.cc_cookie })
})

router.get('/consent', (req, res) => {
    console.log('consent')
    res.cookie('cc_cookie', 'consented', { maxAge: cookieExpireDays*60*1000, httpOnly: true });
    // ใช้ในการบันทึกการยินยอมของผู้ใช้ในการใช้งานคุกกี้และข้อมูลส่วนบุคคลในการดำเนินงานของเว็บไซต์
    res.end();
})

router.get('/withdraw', (req, res) => {
    console.log('withdraw')
    res.cookie('cc_cookie', 'withdrawed', { maxAge: cookieExpireDays*60*1000, httpOnly: true });
    // res.clearCookie('cc_cookie');
    res.end();
})

module.exports = router