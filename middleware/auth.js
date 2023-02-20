const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provded");
  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decodedPayload;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
};

module.exports = auth;
