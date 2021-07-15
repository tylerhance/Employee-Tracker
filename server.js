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

// User/Employer prompts
const promptUser = () => {
    inquirer.prompt([
        {
            name: "choices",
            type: "list",
            message: "Please select an option: ",
            choices: [
                "View all employees",
                "View all roles",
                "view all departments",
                "View all employees by department",
                "View department budgets",
                "Update employee role",
                "Update employee manager",
                "Add employee",
                "Add role",
                "Add department",
                "Remove employee",
                "Remove role",
                "Remove department",
                "Exit"
            ]
        }
    ])
    .then((answers) => {
        const {choices} = answers;

        if (choices === "View all employees") {
            viewAllEmployees();
        }
        if (choices === "View all roles") {
            viewAllRoles();
        }
        if (choices === "View all departments") {
            viewAllDepartments();
        }
        if (choices === "View all employees by department") {
            viewEmployeesByDepartment();
        }
        if (choices === "View department budgets") {
            viewDepartmentBudget();
        }
        if (choices === "Update employee role") {
            updateEmployeeRole();
        }
        if (choices === "Update employee manager") {
            updateEmployeeManager();
        }
        if (choices === "Add employee") {
            addEmployee();
        }
        if (choices === "Add role") {
            addRole();
        }
        if (choices === "Add department") {
            addDepartment();
        }
        if (choices === "Remove employee") {
            removeEmployee();
        }
        if (choices === "Remove role") {
            removeRole();
        }
        if (choices === "Remove department") {
            removeDepartment();
        }
        if (choices === "Exit") {
            connection.end();
        }
    });
};