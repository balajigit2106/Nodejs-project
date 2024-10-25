const sql = require("mssql");
const config = require("../config/dbConfig");

const loginModel = {
  Login: async (email, password) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool
        .request()
        .input("email", sql.VarChar, email)
        .input("password", sql.VarChar, password)
        .query("SELECT * FROM Users WHERE email = @email");
      return result.recordset;
    } catch (error) {
      throw new Error("Error while login");
    }
  },
};

module.exports = loginModel;
