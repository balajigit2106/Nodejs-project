const sql = require("mssql");
const config = require("../config/dbConfig");

//user Model
const userModel = {
  createUser: async (name, email, mobile, password, teamId, organizationId) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool
        .request()
        .input("name", sql.VarChar, name)
        .input("email", sql.VarChar, email)
        .input("mobile", sql.VarChar, mobile)
        .input("password", sql.VarChar, password)
        .input("teamId", sql.Int, teamId)
        .input("organizationId", sql.Int, organizationId)
        .query(
          "INSERT INTO Users (name, email,mobile,password,teamId,organizationId) VALUES (@name, @email, @mobile, @password, @teamId, @organizationId)"
        );
      return result;
    } catch (error) {
      throw new Error("Error inserting user: " + error.message);
    }
  },

  getUsers: async (value) => {
    const pool = await sql.connect(config);
    if (value.id) {
      try {
        const result = await pool
          .request()
          .input("id", sql.Int, value.id)
          .query("SELECT * FROM Users WHERE id = @id");
        return result.recordset;
      } catch (error) {
        console.log(error);
      }
    } else if (value.name) {
      try {
        const result = await pool
          .request()
          .input("name", sql.VarChar, value.name)
          .query("SELECT * FROM Users WHERE name LIKE '%' + @name + '%' ");
        return result.recordset;
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const result = await pool.request().query("SELECT * from Users");
        return result.recordset;
      } catch (err) {
        throw new Error("Error fetching users: " + err.message);
      }
    }
  },

  updateUser: async (
    id,
    name,
    email,
    mobile,
    password,
    teamId,
    organizationId
  ) => {
    try {
      const pool = await sql.connect(config);

      // Update the user by ID
      const result = await pool
        .request()
        .input("id", sql.Int, id)
        .input("name", sql.VarChar, name)
        .input("email", sql.VarChar, email)
        .input("mobile", sql.VarChar, mobile)
        .input("password", sql.VarChar, password)
        .input("teamId", sql.Int, teamId)
        .input("organizationId", sql.Int, organizationId)
        .query(
          "UPDATE Users SET name = @name, email = @email, mobile = @mobile, password = @password, teamId = @teamId, organizationId = @organizationId WHERE id = @id"
        );
      return result;
    } catch (error) {
      throw new Error("Error updating user: " + error.message);
    }
  },

  deleteUser: async (id) => {
    try {
      const pool = await sql.connect(config);

      await pool
        .request()
        .input("id", sql.Int, id)
        .query("DELETE FROM Users WHERE id = @id");
    } catch (error) {
      throw new Error("Error deleting user" + error.message);
    }
  },
};

module.exports = userModel;
