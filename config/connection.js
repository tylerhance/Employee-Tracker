const mysql = require("mysql2");

require("dotenv").config();

const connection = mysql.creatConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "employees"
});

module.exports = connection;