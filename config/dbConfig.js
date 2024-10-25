const sql = require("mssql");
require("dotenv").config();

const config = {
  user: "sa",
  password: "node@123",
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  driver: "ODBC Driver 17 for SQL Server",
  options: {
    trustedConnection: true, // Enable Windows Authentication
    encrypt: true, // Set to true if using SSL
    trustServerCertificate: true, // Optional
  },
};
module.exports = config;
async function testConnection() {
  try {
    await sql.connect(config);
    console.log("Connected to SQL Server successfully!");
  } catch (err) {
    console.error("SQL connection error:", err);
  } finally {
    await sql.close();
  }
}

testConnection();
