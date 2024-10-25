const sql = require("mssql");
const config = require("../config/dbConfig");

const organizationModel = {
  createOrganization: async (name, email, mobile, address) => {
    const pool = await sql.connect(config);
    try {
      const result = await pool
        .request()
        .input("name", sql.VarChar, name)
        .input("email", sql.VarChar, email)
        .input("mobile", sql.VarChar, mobile)
        .input("address", sql.VarChar, address)
        .query(
          "INSERT INTO Organization (name, mobile, address,email) VALUES (@name, @mobile, @address, @email)"
        );
      return result;
    } catch (error) {
      console.log(error);
    }
  },

  getOrganizations: async (value) => {
    const pool = await sql.connect(config);
    let organization = [];
    let users = [];

    if (value.id) {
      try {
        const organizationdetails = await pool
          .request()
          .input("id", sql.Int, value.id)
          .query("SELECT * FROM Organization WHERE id = @id");
        organization = organizationdetails.recordset;
      } catch (error) {
        console.log(error);
      }

      if (organization.length <= 0) {
        return organization;
      }

      try {
        const usersdetails = await pool
          .request()
          .input("organizationId", sql.Int, value.id)
          .query("SELECT * FROM Users WHERE organizationId = @organizationId");
        users = usersdetails.recordset;
      } catch (error) {
        console.log(error);
      }

      const result = organization.map((item) => {
        return { ...item, users: users };
      });

      return result;
    } else if (value.name) {
      try {
        const result = await pool
          .request()
          .input("name", sql.VarChar, value.name)
          .query(
            "SELECT * FROM Organization WHERE name LIKE '%' + @name + '%'"
          );
        return result.recordset;
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const result = await pool.request().query("SELECT* FROM Organization");
        return result.recordset;
      } catch (error) {
        console.log(error);
      }
    }
  },

  deleteOrganization: async (id) => {
    const pool = await sql.connect(config);
    try {
      const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query("DELETE FROM Organization WHERE id = @id");
      return result;
    } catch (error) {
      return error;
    }
  },
};

module.exports = organizationModel;
