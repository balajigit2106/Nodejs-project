const sql = require("mssql");
const config = require("../config/dbConfig");
const userModel = require("../models/userModel");
const Validation = require("../Validation/Validation");
// const argon2 = require('argon2');

const createUser = async (req, res) => {
  const { name, email, mobile, password, teamId, organizationId } = req.body;

  const nameValidate = Validation.nameValidator(name, "Name");
  const emailValidate = Validation.emailValidator(email);
  if (nameValidate) {
    return res.status(400).send({ message: nameValidate });
  } else if (emailValidate) {
    return res.status(400).send({ message: emailValidate });
  }

  // Check if user already exists
  const pool = await sql.connect(config);

  const existingUser = await pool
    .request()
    .input("email", sql.VarChar, email)
    .query("SELECT * FROM Users WHERE email = @email");

  if (existingUser.recordset.length > 0) {
    return res.status(400).send({ message: "Email already exists" });
  }
  // const hashedPassword = await argon2.hash(password);
  try {
    await userModel.createUser(
      name,
      email,
      mobile,
      password,
      teamId,
      organizationId
    );
    res.status(200).send({ message: "User created successfully!" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "error creating user", details: error.message });
  }
};

// Controller function to get users
const getUsers = async (request, response) => {
  const value = request.query;
  if (value) {
    try {
      const user = await userModel.getUsers(value);
      if (user.length <= 0) {
        return response.status(400).send({ message: "User not found" });
      } else {
        return response.status(200).json(user); // Send the users as JSON
      }
    } catch (err) {
      response
        .status(500)
        .send({ message: "Error fetching users", details: err.message });
    }
  } else {
    try {
      const users = await userModel.getUsers();
      response.status(200).json(users); // Send the users as JSON
    } catch (err) {
      response
        .status(500)
        .send({ message: "Error fetching users", details: err.message });
    }
  }
};

const updateUser = async (req, res) => {
  const { id, name, email, mobile, password, teamId, organizationId } =
    req.body; // Get updated fields from the request body

  // Validate input if necessary
  const emailValidate = Validation.emailValidator(email);
  if (emailValidate) {
    return res.status(400).send({ message: emailValidate });
  }
  const pool = await sql.connect(config);
  try {
    const existingUser = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Users WHERE @id= id");

    if (existingUser.recordset.length <= 0) {
      res.status(400).send({ message: "User not exists" });
    } else {
      await userModel.updateUser(
        id,
        name,
        email,
        mobile,
        password,
        teamId,
        organizationId
      );
      res.status(200).send({ message: "User updated successfully!" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating user", details: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.query;
  console.log("delete id", id);
  try {
    const result = await userModel.deleteUser(id);
    return res.status(200).send({ message: "User deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting user", details: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
};
