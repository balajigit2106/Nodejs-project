const loginModel = require("../models/loginModel");
const jwt = require("jsonwebtoken");

const Login = async (request, response) => {
  const { email, password } = request.body;
  try {
    const loginresponse = await loginModel.Login(email, password);
    const userDetails = loginresponse[0];
    // Verify the password using Argon2
    // const isPasswordValid = await argon2.verify(userDetails.password, password);

    if (!userDetails) {
      response.status(400).send({ message: "Invalid email" });
      return;
    } else if (userDetails.password != password) {
      response.status(400).send({ message: "Invalid password" });
      return;
    } else {
      const token = generateToken(userDetails);
      response.status(200).send({
        message: "Login successfully!",
        userDetails: userDetails,
        token: token,
      });
    }
  } catch (error) {
    response
      .status(500)
      .send({ message: "Login failed", details: error.message });
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email }, //Payload
    process.env.JWT_SECRET, // Secret
    { expiresIn: "1d" } // Token expires in 1 hour
  );
};

module.exports = { Login };

// {
//   "id":3,
//   "name":"Allice A",
//   "email":"allice@gmail.com",
//   "password":"node123",
//   "mobile":"77689766",
//   "teamId": 2
// }
