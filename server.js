const connection = require("./config/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const chalk = require("chalk");
const figlet = require("figlet");
// const validate = require("./js/validate");

// DB connection and main title
connection.connect((error) => {
    if(error) throw error;
    console.log(chalk.yellow.bold(`==============================================================`));
    console.log(``);
    console.log(chalk.greenBright.bold(figlet.textSync("Employee Tracker")));
    console.log(``);
    console.log(`                                                   ` + chalk.greenBright.bold("Created by: Tyler Hance"));
    console.log(``);
    console.log(chalk.yellow.bold(`===============================================================`));
    promptUser();
});

