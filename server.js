const connection = require("./config/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const chalk = require("chalk");
const figlet = require("figlet");
const { connect } = require("http2");
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
    console.table(response);
    console.log(chalk.blueBright.bold(`======================================================`));
    promptUser();
    });
};

// View all employees by department
const viewEmployeesByDepartment = () => {
    const sql = `SELECT employee.first_name,
                 employee.last_name,
                 department.department_name AS department
                 FROM employee
                 LEFT JOIN role ON employee.role_id = role.id
                 LEFT JOIN department ON role.department_id = department.id`;
    connection.query(sql, (error, response) => {
        if(error) throw error;
        console.log(chalk.blueBright.bold(`======================================================`));
        console.log(`                        ` + chalk.green.bold(`Employees by Department: `));
        console.log(chalk.blueBright.bold(`======================================================`));
        console.table(response);
        console.log(chalk.blueBright.bold(`======================================================`));
        promptUser();
    });
};

// View all departments by budget
const viewDepartmentBudget = () => {
    console.log(chalk.blueBright.bold(`======================================================`));
    console.log(`                        ` + chalk.green.bold(`Budget by Department: `));
    console.log(chalk.blueBright.bold(`======================================================`));
    const sql = `SELECT department_id AS id,
                 department.department_name AS department,
                 SUM(salary) AS budget
                 FROM role
                 INNER JOIN department ON role.department_id = department.id GROUP BY role.department_id`;
    connection.query(sql, (error, response) => {
        if(error) throw error;
        console.table(response);
        console.log(chalk.blueBright.bold(`======================================================`));
        promptUser();
    });
};

// Add a new employee
const addEmployee = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: " What's the employee's first name?",
        },
        {
            type: "input",
            name: "lastName",
            message: "What's the employee's last name?",
        },
    ])
    .then(answer => {
        const newEmployee = [answer.firstName, answer.lastName]
        const roleSql = `SELECT role.id, role.title FROM role`;
        connection.promise().query(roleSql, (error, data) => {
            if(error) throw error;
            const roles = data.map(({ id, title}) => ({ name: title, value: id}));
            inquirer.prompt([
                {
                    type: "list",
                    name: "role",
                    message: "What's the employee's role?",
                    choices: roles
                }
            ])
            .then(roleChoice => {
                const role = roleChoice.role;
                newEmployee.push(role);
                const managerSql = `SELECT * FROM employee`;
                connection.promise().query(managerSql, (error, data) => {
                    if(error) throw error;
                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "manager",
                            message: "Who is the manager for this employee?",
                            choices: managers
                        }
                    ])
                    .then(managerChoice => {
                        const manager = managerChoice.manager;
                        newEmployee.push(manager);
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                     VALUES (?, ?, ?, ?)`;
                        connection.query(sql, newEmployee, (error) => {
                            if(error) throw error;
                            console.log("New employee has been added successfully!")
                            viewAllEmployees();
                        });
                    });
                });
            });
        });
    });
};

// Add a new role
const addRole = () => {
    const sql = 'SELECT * FROM department'
    connection.promise().query(sql, (error, response) => {
        if(error) throw error;
        let deptNamesArr = [];
        response.forEach((department) => {deptNamesArr.push(department.department_name);
        });
        deptNamesArr.push("Create Department");
    });
    inquirer.prompt([
        {
            name: "departmentName",
            type: "list",
            message: "Which department does this new role belong to?",
            choices: deptNamesArr
        }
    ])
    .then((answer) => {
        if(answer.departmentName === "Create Department"){
            this.addDepartment();
        }else{
            addRoleContinue(answer);
        }
    });

    const addRoleContinue = (departmentData) => {
        inquirer.prompt([
            {
                name: "role",
                type: "input",
                message: "What is the name of the new role?",
            },
            {
                name: "salary",
                type: "input",
                message: "What's the salary for the new role?"
            }
        ])
        .then((answer) => {
            let createdRole = answer.newRole;
            let departmentId;

            response.forEach((department) => {
                if(departmentData.departmentName === department.department_name) {
                    departmentId = department.id;
                }
            });
            let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            let newEmployee = [createdRole, answer.salary, departmentId];

            connection.promise().query(sql, newEmployee, (error) => {
                if(error) throw error;
                console.log(chalk.blueBright.bold(`======================================================`));
                console.log(`                        ` + chalk.green.bold(`New Role Successfully Created!`));
                console.log(chalk.blueBright.bold(`======================================================`));
                viewAllRoles();
            });
        });
    };
};

// 