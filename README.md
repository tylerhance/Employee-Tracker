# Employee-Tracker

<h2>Description</h2>

* I was tasked with creating a CLI content management system to allow management a solution to effectively manage employee's roles using Node, Inquirer, and MySQL. 

## Demo Screenshot

![Site](./assets/images/employeetracker.jpeg)

# Table of Contents
* [User Story](#userstory)
* [Installation](#installation)
* [Usage](#usage)
* [Questions](#questions)

<h2>User Story</h2>

* AS a business owner
  I WANT to be able to view and manage the departments, roles, and employees in my company
  SO THAT I can organize and plan my business

- This application will allow users to:
    <li>Add employees, roles, and departments</li>
    <li>View employees, roles, and departments</li>
    <li>View departments by budget and view employees by department</li>
    <li>Update employee roles and update the employee manager</li>
    <li>Remove employee, role, and/or departments</li>

<h2>Installation</h2>

*  Clone/Fork the repo:

```
git clone git@github.com:tylerhance/Employee-Tracker.git
```

* Install dependencies:

```
npm i
```

* Create the DB using the employee_trackerDB and seeds.sql files.

```
DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;


CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department (id)
);

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role (id),
    FOREIGN KEY (manager_id) REFERENCES employee (id)
);
```

* Initialize Server:

```
npm start
```

<h2>Usage</h2>

* Utilize the CLI interface to manage and maintain employees, roles, and departments.

* A walk-through video demonstrating the apps functionality can be viewed [Here](https://drive.google.com/file/d/1s4M04WALA-40aTtKdi1ozL4Dhx8_v7mn/view)<br>

<h2>Questions?</h2>

* If you have any questions, please feel free to contact me @ tyler.hance@gmail.com or visit my repo for additional projects @ https://github.com/tylerhance.