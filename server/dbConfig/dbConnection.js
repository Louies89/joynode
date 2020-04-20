
const options = { // Initialization Options
  promiseLib: require('bluebird')
};

const pgp = require('pg-promise')(options);

//Database URL format: postgres://{db_username}:{db_password}@{host}:{port}/{db_name}
const connectionString = 'postgres://postgres:admin@localhost:5432/joy'; 

// Creating a new database instance from the connection details:
const db = pgp(connectionString);  //Connection Pool

// Exporting the database object for shared use:
module.exports = db;