const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  const token = req.headers.token;

  const decodedData = jwt.verify(token, JWT_SECRET);
    console.log(decodedData);
  if (decodedData) {
    req.userId = decodedData.id;    
    next();
  } else {
    res.status(403).json({
      msg: "Invalid Credentials",
    });
  }
}

module.exports = authMiddleware;