const isConsent = ((req, res, next) => {
    let cookies = req.cookies;
    console.log('check cookie:', cookies.cc_cookie)
    if (typeof cookies.cc_cookie === "undefined"){
        res.cookie('cc_cookie', 'nonconsented', { maxAge: 180*24*60*60*1000, httpOnly: true });
    }
    next()
})

module.exports = isConsent