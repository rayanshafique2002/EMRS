//Setup pg-promise to use PostgreSQL
const pgp = require("pg-promise")();
var types = pgp.pg.types;
require("dotenv").config();

var moment = require("moment");
var parseDate = function parseDate(val) {
  return val === null ? null : moment(val).format("YYYY-MM-DD");
};
var DATATYPE_DATE = 1082;
types.setTypeParser(DATATYPE_DATE, function (val) {
  return val === null ? null : parseDate(val);
});

const conn = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  max: 50,
  connectionTimeoutMs: 5000,
};

console.log("Database connection config:");
console.log(`  Host: ${process.env.DB_HOST}`);
console.log(`  Port: ${process.env.DB_PORT}`);
console.log(`  Database: ${process.env.DB_DATABASE}`);
console.log(`  User: ${process.env.DB_USER}`);
console.log(`  Password: ${process.env.DB_PASS ? "***hidden***" : "NOT SET"}`);

const db = pgp(conn);

async function testConnection() {
  try {
    const connection = await db.connect();
    console.log("✓ Database connection successful");
    connection.done();
    return true;
  } catch (error) {
    console.error("✗ Database connection FAILED:", error.message);
    return false;
  }
}

if (require.main === module) {
  testConnection().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = db;
