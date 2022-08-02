const ifNotLoggedIn = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
}

const ifLoggedIn = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/card_manager');
    }
    next();
}

const isAuth = (req, res, next) => {
    if(false) {
    // if(!req.session.isAuth) {
        req.flash('status', 'Unauthorized')
        req.flash('error', 'You are not allowed to access this page')
        return res.status(401).render('error')
    }
    next()
}

module.exports = {
    ifNotLoggedIn,
    ifLoggedIn,
    isAuth
}