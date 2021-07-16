const connection = require("./config/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const chalk = require("chalk");
const figlet = require("figlet");
// const validate = require("./js/validate");

// DB connection and main title
connection.connect((error) => {
    if(error) throw error;
    console.log(chalk.blueBright.bold(`==============================================================`));
    console.log(``);
    console.log(chalk.greenBright.bold(figlet.textSync("Employee Tracker")));
    console.log(``);
    console.log(`                                                   ` + chalk.greenBright.bold("Created by: Tyler Hance"));
    console.log(``);
    console.log(chalk.blueBright.bold(`===============================================================`));
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

// View all employees
const viewAllEmployees = () => {
    let sql = `SELECT employee.id,
                employee.first_name,
                employee.last_name,
                role.title
                department.department_name AS "department",
                role.salary
                FROM employee, role, department
                WHERE department.id = role.department_id
                AND role_id = employee.role_id
                ORDER BY employee.id ASC`;
    connection.promise().query(sql, (error, response) => {
        if(error) throw error;
        console.log(chalk.blueBright.bold(`======================================================`));
        console.log(`                        ` + chalk.green.bold(`Current Employees: `));
        console.log(chalk.blueBright.bold(`======================================================`));
        console.table(response);
        console.log(chalk.blueBright.bold(`======================================================`));
        promptUser();
    });
};

// View all roles
const viewAllRoles = () => {
    console.log(chalk.blueBright.bold(`======================================================`));
    console.log(`                        ` + chalk.green.bold(`Current Employee Roles: `));
    console.log(chalk.blueBright.bold(`======================================================`));
    const sql = `SELECT role.id, role.title, department.department_name AS department
                    FROM role
                    INNER JOIN department ON role.department_id = department.id`;
    connection.promise().query(sql, (error, response) => {
        if(error) throw error;
        response.forEach((role) => {
        console.log(role.title);
        });
        console.log(chalk.blueBright.bold(`======================================================`));
        promptUser();
    });
};

// View all departments
const viewAllDepartments = () => {
    const sql = `SELECT department.id AS id, department.department_name AS department FROM department`;
    connection.promise().query(sql, (error, response) => {
    if (error) throw error;
    console.log(chalk.blueBright.bold(`======================================================`));
    console.log(`                        ` + chalk.green.bold(`All Departments: `));
    console.log(chalk.blueBright.bold(`======================================================`));
    console.log(console.table);
    console.log(chalk.blueBright.bold(`======================================================`));
    promptUser();
    });
};