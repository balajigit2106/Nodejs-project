const emailRegex = /^[a-zA-Z0-9._-]{2,}@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
const jwt = require("jsonwebtoken");

const nameValidator = (name, label) => {
  let error = "";

  if (!name || name.length <= 0) error = `${label} is required`;
  return error;
};

const mobileValidator = (mobile) => {
  let error = "";

  if (!mobile || mobile.length < 10) error = "mobile is required";
  return error;
};

const emailValidator = (email) => {
  let error = "";

  if (!email || email.length <= 0) error = "Email is required";
  else if (!emailRegex.test(email)) error = "Email is not valid";
  return error;
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract Bearer token

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized! Invalid token" });
    }

    // If token is valid, store user info in the request and move to the next middleware
    req.user = decoded;
    next();
  });
};

module.exports = {
  nameValidator,
  mobileValidator,
  emailValidator,
  verifyToken,
};
