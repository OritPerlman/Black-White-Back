const jwt = require("jsonwebtoken");
const { config } = require("../config/secret")


exports.auth = (req, res, next) => {
    let token = req.header("x-api-key")
    if (!token) {
        return res.status(401).json({ msg: "You need to send token to this endpoint url" })
    }
    try {
        let decodeToken = jwt.verify(token, config.tokenSecret);
        req.tokenData = decodeToken;
        return res.status(200).json({ msg: "Token approved" })
        next();
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({ msg: "Token invalid or expired, log in again or you hacker!" })
    }
}

//auth of admin:
exports.authAdmin = (req, res, next) => {
    let token = req.header("x-api-key");
    if (!token) {
        return res.status(401).json({ msg: "You need to send token to this endpoint url" });
    }
    try {
        let decodeToken = jwt.verify(token, config.tokenSecret);
        // check if the role in the token of admin
        if (decodeToken.role != true) {
            return res.status(401).json({ msg: "Token invalid or expired, code: 3" });
        }
        req.tokenData = decodeToken;
        return res.status(200).json({ msg: "Admin token" });
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ msg: "Token invalid or expired, log in again or you hacker!" });
    }
}