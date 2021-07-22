INSERT INTO department(department_name)
VALUES ("Marketing"), ("Sales"), ("Finance"), ("HR"), ("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES ("Marketing Director", 90000, 1), ("Marketing Assistant", 65000, 1), ("Senior Engineer", 130000, 5), ("Engineer", 80000, 5), ("CFO", 275000, 3), ("Sales Manager", 75000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 1, null), ("Greg", "Johnson", 1, 1), ("Jim", "White", 3, null), ("Bob", "Long", 5, 2), ("Frank", "Jones", 5, 1);