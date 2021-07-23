const connection = require("./config/connection");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const chalk = require("chalk");
const figlet = require("figlet");

// DB connection and main title
connection.connect((error) => {
    if(error) throw error;
    console.log(chalk.blueBright.bold(`====================================================================================================`));
    console.log(``);
    console.log(chalk.greenBright.bold(figlet.textSync("Employee Tracker")));
    console.log(``);
    console.log(`                                                   ` + chalk.greenBright.bold("Created by: Tyler Hance"));
    console.log(``);
    console.log(chalk.blueBright.bold(`====================================================================================================`));
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
                "View all departments",
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
    const sql = `SELECT employee.id,
    employee.first_name,
    employee.last_name,
    role.title,
    role.salary,
    department.department_name AS department
    FROM employee LEFT JOIN role on employee.role_id = role.id
    LEFT JOIN department on role.department_id = department.id
    ORDER BY employee.id ASC`;
    connection.query(sql, (error, response) => {
        if(error) throw error;
        console.log(chalk.blueBright.bold(`====================================================================================================`));
        console.log(`                        ` + chalk.green.bold(`Current Employees: `));
        console.log(chalk.blueBright.bold(`====================================================================================================`));
        console.table(response);
        console.log(chalk.blueBright.bold(`====================================================================================================`));
        promptUser();
    });
};

// View all roles
const viewAllRoles = () => {
    console.log(chalk.blueBright.bold(`====================================================================================================`));
    console.log(`                        ` + chalk.green.bold(`Current Employee Roles: `));
    console.log(chalk.blueBright.bold(`====================================================================================================`));
    const sql = `SELECT role.id, role.title, role.salary, department.department_name AS department
                    FROM role
                    INNER JOIN department ON role.department_id = department.id`;
    connection.query(sql, (error, response) => {
        if(error) throw error;
        // response.forEach((role) => {
        // console.log(role);
        // });
        console.table(response);
        console.log(chalk.blueBright.bold(`====================================================================================================`));
        promptUser();
    });
};

// View all departments
const viewAllDepartments = () => {
    const sql = `SELECT * FROM department`;
    connection.query(sql, (error, response) => {
    if (error) throw error;
    console.log(chalk.blueBright.bold(`====================================================================================================`));
    console.log(`                        ` + chalk.green.bold(`All Departments: `));
    console.log(chalk.blueBright.bold(`====================================================================================================`));
    console.table(response);
    console.log(chalk.blueBright.bold(`====================================================================================================`));
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
        console.log(chalk.blueBright.bold(`====================================================================================================`));
        console.log(`                        ` + chalk.green.bold(`Employees by Department: `));
        console.log(chalk.blueBright.bold(`====================================================================================================`));
        console.table(response);
        console.log(chalk.blueBright.bold(`====================================================================================================`));
        promptUser();
    });
};

// View all departments by budget
const viewDepartmentBudget = () => {
    console.log(chalk.blueBright.bold(`====================================================================================================`));
    console.log(`                        ` + chalk.green.bold(`Budget by Department: `));
    console.log(chalk.blueBright.bold(`====================================================================================================`));
    const sql = `SELECT department_id AS id,
                 department.department_name AS department,
                 SUM(salary) AS budget
                 FROM role
                 INNER JOIN department ON role.department_id = department.id GROUP BY role.department_id`;
    connection.query(sql, (error, response) => {
        if(error) throw error;
        console.table(response);
        console.log(chalk.blueBright.bold(`====================================================================================================`));
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
        connection.query(roleSql, (error, data) => {
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
                connection.query(managerSql, (error, data) => {
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

// Add new department
const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "department_name",
            message: "What is the name of the new department?",
        }
        
    ]) .then(answers => {
        console.log(answers)
        const sql = `INSERT INTO department (department_name) VALUE ("${answers.department_name}")`;
        connection.query(sql, (error) => {
            if (error) throw error;
            console.log("Department added!")
            promptUser();
        })

    });
    
};

// Add a new role
const addRole = () => {
    const sql = 'SELECT * FROM department'
    connection.query(sql, (error, response) => {
        if(error) throw error;
        let deptNamesArr = [];
        response.forEach((department) => {
            deptNamesArr.push({
                name: department.department_name,
                value: department.id
            });
        });
        console.log("This is the depts name array", deptNamesArr);
    inquirer.prompt([
        {
            name: "departmentName",
            type: "list",
            message: "Which department does this new role belong to?",
            choices: deptNamesArr
        }
    ])
    .then((answer) => {
        console.log(answer)
        addRoleContinue(answer.departmentName)
    });
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
            let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            let newEmployee = [answer.role, answer.salary, departmentData];

            connection.query(sql, newEmployee, (error) => {
                if(error) throw error;
                console.log(chalk.blueBright.bold(`====================================================================================================`));
                console.log(`                        ` + chalk.green.bold(`New Role Successfully Created!`));
                console.log(chalk.blueBright.bold(`====================================================================================================`));
                viewAllRoles();
            });
        });
    };
};

// Update employee's role
const updateEmployeeRole = () => {
    inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the employee's ID you want to be updated",
        name: "updateEmployee"
      },
      {
        type: "input",
        message: "Enter the new role ID for that employee",
        name: "newRole"
      }
    ])
    .then((res) => {
        const updateEmployee = res.updateEmployee;
        const newRole = res.newRole;
        const queryUpdate = `UPDATE employee SET role_id = "${newRole}" WHERE id = "${updateEmployee}"`;
        connection.query(queryUpdate, function (error, res) {
          if (error) {
              throw error;
          }
          console.table(res);
          console.log(chalk.blueBright.bold(`====================================================================================================`));
          console.log(`                        ` + chalk.green.bold(`Employee Role Updated!`));
          console.log(chalk.blueBright.bold(`====================================================================================================`));
          promptUser();
        });
      });
    };

// Update employee manager
const updateEmployeeManager = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id FROM employee`;

    connection.query(sql, (error, response) => {
        let employeeNamesArr = [];
        response.forEach((employee) => {
            employeeNamesArr.push(`${employee.first_name} ${employee.last_name}`);
        });

        inquirer.prompt([
            {
                name: "selectedEmployee",
                type: "list",
                message: "What employee has a new manager?",
                choices: employeeNamesArr
            },
            {
                name: "newManager",
                type: "list",
                message: "Who is the employee's new manager?",
                choices: employeeNamesArr
            }
        ])
        .then((answer) => {
            let employeeId, managerId;
            response.forEach((employee) => {
                if(answer.selectedEmployee === `${employee.first_name} ${employee.last_name}`){
                    employeeId = employee.id;
                }
                if(answer.newManager === `${employee.first_name} ${employee.last_name}`) {
                    managerId = employee.id;
                }
            });

            let sql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;

            connection.query(sql, [managerId, employeeId], (error) => {
            if(error) throw error;
            console.log(chalk.blueBright.bold(`====================================================================================================`));
            console.log(`                        ` + chalk.green.bold(`Employee Manager Updated!`));
            console.log(chalk.blueBright.bold(`====================================================================================================`));
            promptUser();
            })   
        });
    });
};

// DELETE employee
const removeEmployee = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;

    connection.query(sql, (error, response) => {
        if(error) throw error;
        let employeeNamesArr = [];
        response.forEach((employee) => {employeeNamesArr.push(`${employee.first_name} ${employee.last_name}`);
    });
    inquirer.prompt([
        {
            name: "selectedEmployee",
            type: "list",
            message: "What employee would you like to remove?",
            choices: employeeNamesArr
        }
    ])
    .then((answer) => {
        let employeeId;

        response.forEach((employee) => {
            if(answer.selectedEmployee === `${employee.first_name} ${employee.last_name}`){
                employeeId = employee.id;
            } 
        });

        let sql = `DELETE FROM employee WHERE employee.id = ?`;
        connection.query(sql, [employeeId], (error) => {
            if(error) throw error;
            console.log(chalk.redBright.bold(`====================================================================================================`));
            console.log(`                    ` + chalk.redBright.bold(`Employee Successfully Removed`));
            console.log(chalk.redBright.bold(`====================================================================================================`));
            viewAllEmployees();
        });
     });
    });
};

// DELETE role
const removeRole = () => {
    let sql = `SELECT role.id, role.title FROM role`;

    connection.query(sql, (error, response) => {
        if(error) throw error;
        let roleNamesArray = [];
        response.forEach((role) => {roleNamesArray.push(role.title);
        });
        
        inquirer.prompt([
            {
                name: "selectedRole",
                type: "list",
                message: "What role do you wish to remove?",
                choices: roleNamesArray 
            }
        ])
        .then((answer) => {
            let roleId;

            response.forEach((role) => {
                if (answer.selectedRole === role.title) {
                    roleId = role.id;
                }
            });

            let sql = `DELETE FROM role WHERE role.id = ?`;
            connection.query(sql, [roleId], (error) => {
                if(error) throw error;
            console.log(chalk.redBright.bold(`====================================================================================================`));
            console.log(`                    ` + chalk.redBright.bold(`Role Successfully Removed`));
            console.log(chalk.redBright.bold(`====================================================================================================`));
            viewAllRoles();
            })
        });
    });
};

// DELETE department
const removeDepartment = () => {
    let sql = `SELECT department.id, department_name FROM department`;
    connection.query(sql, (error, response) => {
        if(error) throw error;
        let departmentNamesArray = [];
        response.forEach((department) => {departmentNamesArray.push(department.department_name);
        });

        inquirer.prompt([
            {
                name: "selectedDept",
                type: "list",
                message: "What department do you wish to remove?",
                choices: departmentNamesArray
            }
        ])
        .then((answer) => {
            let departmentId;

            response.forEach((department) => {
                if(answer.selectedDept === department.department_name){
                    departmentId = department.id;
                }
            });

            let sql = `DELETE FROM department WHERE department.id = ?`;
            connection.query(sql, [departmentId], (error) => {
                if(error) throw error;
            console.log(chalk.redBright.bold(`====================================================================================================`));
            console.log(`                    ` + chalk.redBright.bold(`Department Successfully Removed`));
            console.log(chalk.redBright.bold(`====================================================================================================`));
            viewAllDepartments();
            });
        });
    });
};