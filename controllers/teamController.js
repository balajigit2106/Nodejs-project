const sql = require("mssql");
const config = require("../config/dbConfig");
const teamModel = require("../models/teamModel");

const createTeam = async (request, response) => {
  const { name, description } = request.body;
  try {
    await teamModel.createTeam(name, description);
    response.status(201).send({ message: "Team created successfully!" });
  } catch (error) {
    response.status(500).send({ message: "Error creating team" });
  }
};

const updateTeam = async (request, response) => {
  const { id, name, description } = request.body;

  const pool = await sql.connect(config);
  try {
    const existingTeam = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Team WHERE @id= id");

    if (existingTeam.recordset.length <= 0) {
      response.status(400).send({ message: "Team not exists" });
    } else {
      await teamModel.updateTeam(id, name, description);
      response.status(200).send({ message: "Team updated successfully!" });
    }
  } catch (error) {
    response
      .status(500)
      .send({ message: "Team update failed", details: error });
  }
};

const getTeams = async (request, response) => {
  const requests = request.query;
  //   let value = id ? parseInt(id) : name ? name : null;
  if (requests) {
    try {
      const result = await teamModel.getTeams(requests);
      if (result.length <= 0) {
        response.status(400).send({ message: "team not found" });
      } else {
        return response.status(200).json(result);
      }
    } catch (error) {
      response
        .status(500)
        .send({ message: "Error getting team", details: error.message });
    }
  } else {
    try {
      const result = await teamModel.getTeams();
      return response.status(200).json(result);
    } catch (error) {
      response
        .status(500)
        .send({ message: "Error getting teams", details: error });
    }
  }
};

module.exports = { createTeam, updateTeam, getTeams };
