const sql = require("mssql");
const config = require("../config/dbConfig");
const organizationModel = require("../models/organizationModel");
const {
  nameValidator,
  mobileValidator,
  emailValidator,
} = require("../Validation/Validation");

const createOrganization = async (request, response) => {
  const { name, email, mobile, address } = request.body;

  const nameValidate = nameValidator(name, "name");
  const emailValidate = emailValidator(email);
  const mobileValidate = mobileValidator(mobile);
  const pool = await sql.connect(config);

  const existingOrganization = await pool
    .request()
    .input("email", sql.VarChar, email)
    .query("SELECT * FROM Organization WHERE email= @email");

  if (nameValidate) {
    response.status(400).send({ message: nameValidate });
    return;
  } else if (emailValidate) {
    response.status(400).send({ message: emailValidate });
    return;
  } else if (mobileValidate) {
    response.status(400).send({ message: mobileValidate });
    return;
  } else if (existingOrganization.recordset.length >= 1) {
    response.status(400).send({ message: "Organization already exists" });
    return;
  }

  try {
    await organizationModel.createOrganization(name, email, mobile, address);
    response
      .status(201)
      .send({ message: "Organization created successfully!" });
  } catch (error) {
    response
      .status(500)
      .send({ message: "Error creating organization", details: error.message });
  }
};

const getOrganizations = async (request, response) => {
  const value = request.query;
  try {
    const result = await organizationModel.getOrganizations(value);
    response.status(200).json(result);
  } catch (error) {
    response
      .status(500)
      .send({ message: "Error getting organization", details: error.message });
  }
};

const deleteOrganization = async (request, response) => {
  const { id } = request.query;

  if (!id) {
    response.status(400).send({ message: "id is required" });
  }
  try {
    const result = await organizationModel.deleteOrganization(id);
    if (result.message) {
      response.status(400).send({
        message: "Unable to delete. Organization mapped to users",
        details: result.message,
      });
      return;
    }
    response
      .status(200)
      .send({ message: "Organization deleted successfully!" });
  } catch (error) {
    response
      .status(500)
      .send({ message: "Error deleting organization", details: error.message });
  }
};

module.exports = { createOrganization, getOrganizations, deleteOrganization };
