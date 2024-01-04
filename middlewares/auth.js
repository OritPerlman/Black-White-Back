const jwt = require("jsonwebtoken");
const { config } = require("../config/secret")


exports.auth = (req, res, next) => {
    let token = req.header("x-api-key");
    if (!token) {
        return res.status(401).json({ msg: "You need to send a token to this endpoint URL" });
    }
    try {
        let decodeToken = jwt.verify(token, config.tokenSecret);
        req.tokenData = decodeToken;
        // Move the 'next()' call here
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ msg: "Token invalid or expired, log in again or you hacker!" });
    }
};

//auth of admin:
exports.authAdmin = (req, res, next) => {
    let token = req.header("x-api-key");
    console.log('token', token);

    if (!token) {
        return res.status(401).json({ msg: "You need to send token to this endpoint url" });
    }

    try {
        let decodeToken = jwt.verify(token, config.tokenSecret);
        if (!decodeToken.role) {
            console.log('No role found in the token');
            return res.status(401).json({ msg: "You are not an admin, code: 3" });
        }
        req.tokenData = decodeToken;
        console.log('Admin token successfully verified');
        return next(); 
    } catch (err) {
        console.log(err);
        return res.status(401).json({ msg: "Token invalid or expired, log in again or you hacker!" });
    }
}
