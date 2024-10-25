const sql = require("mssql");
const config = require("../config/dbConfig");

const teamModel = {
  createTeam: async (name, description) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool
        .request()
        .input("name", sql.VarChar, name)
        .input("description", sql.VarChar, description)
        .query(
          "INSERT INTO Team (name, description) VALUES (@name, @description)"
        );
      return result;
    } catch (error) {
      console.log("teamerror", error);
    }
  },

  updateTeam: async (id, name, description) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool
        .request()
        .input("id", sql.Int, id)
        .input("name", sql.VarChar, name)
        .input("description", sql.VarChar, description)
        .query(
          "UPDATE Team SET name= @name, description= @description WHERE @id= id"
        );
      return result;
    } catch (error) {
      console.log(error);
    }
  },

  getTeams: async (requests) => {
    const pool = await sql.connect(config);
    let teams = [];
    let users = [];
    if (requests.id) {
      try {
        const teamdetails = await pool
          .request()
          .input("id", sql.Int, requests.id)
          .query("SELECT * FROM Team WHERE @id = id");
        teams = teamdetails.recordset;
      } catch (error) {
        console.log(error);
      }

      if (teams.length <= 0) {
        return teams; //retuen if team not found
      }
      try {
        const userdetails = await pool
          .request()
          .input("id", sql.Int, requests.id)
          .query("SELECT * FROM Users WHERE teamId = @id");
        users = userdetails.recordset;
      } catch (error) {
        console.log(error);
      }

      const result = teams.map((item) => {
        return { ...item, users: users };
      });
      return result;
    } else if (requests.name) {
      try {
        const result = await pool
          .request()
          .input("name", sql.VarChar, requests.name)
          .query("SELECT * FROM Team WHERE name LIKE '%' + @name + '%' ");
        return result.recordset;
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const result = await pool.request().query("SELECT * FROM Team");
        return result.recordset;
      } catch (error) {
        console.log(error);
      }
    }
  },
};

module.exports = teamModel;
