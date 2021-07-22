const mysql = require("mysql2");

require("dotenv").config();

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "t3ganR0cks20",
    database: "employee_trackerDB"
});

module.exports = connection;