const jwtToken = require('jsonwebtoken');


module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[0];
    console.log(token);
    if (!token || token === ' ') {
        req.isAuth = false;
        return next();
    }
    try {
        decodeToken = jwtToken.verify(token, 'IMIRONMAN')
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodeToken) {
        req.isAuth = false;
        return next();
    }
    console.log("I am here")
    req.isAuth = true;
    req.userId = decodeToken.userId;
    next();
}