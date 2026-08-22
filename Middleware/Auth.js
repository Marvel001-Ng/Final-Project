const jwt = require("jsonwebtoken");
require("dotenv").config()

const auth = (req, res, next) =>{
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(401).json({
                msg:"Authorization Failed"
            })
        }
        // extract token
        const token = authHeader.split(" ")[1];
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // STORE INFO
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            msg: "Invalid or Expired token"
        })
    }
}
module.exports = auth