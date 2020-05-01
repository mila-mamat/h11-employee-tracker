DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE employees (
   id INTEGER(11) AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER(11),
  manager_id integer(11),
  PRIMARY KEY (id)
);

CREATE TABLE roles (
   id INTEGER(11) AUTO_INCREMENT NOT NULL,
  title VARCHAR(30),
  salary INTEGER(11),
  department_id integer(11),
  PRIMARY KEY (id)
);

CREATE TABLE departments (
   id INTEGER(11) AUTO_INCREMENT NOT NULL,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

-- cerate departments  
INSERT INTO departments(name)
VALUES("IT");
INSERT INTO departments(name)
VALUES("Marketing");
INSERT INTO departments(name)
VALUES("Human Resources");

-- create  manager roles for department 
INSERT INTO roles(title,salary,department_id)
VALUES("IT Manager",80000,1);
INSERT INTO roles(title,salary,department_id)
VALUES("Marketing Manager",80000,2);
INSERT INTO roles(title,salary,department_id)
VALUES("HR Manager",80000,3);


-- create staff roles for each department 
INSERT INTO roles(title,salary,department_id)
values("IT Engineer",900000,1);
INSERT INTO roles(title,salary,department_id)
values("IT Specialist",60000,1);
INSERT INTO roles(title,salary,department_id)
values("IT Assistant",40000,1);

INSERT INTO roles(title,salary,department_id)
values("Marketing Analyst",70000,2);
INSERT INTO roles(title,salary,department_id)
values("Marketing Coordinator",55000,2);
INSERT INTO roles(title,salary,department_id)
values("Marketing Assistant",40000,2);

INSERT INTO roles(title,salary,department_id)
values("HR Generalist",70000,3);
INSERT INTO roles(title,salary,department_id)
values("HR Specialist",55000,3);
INSERT INTO roles(title,salary,department_id)
values("HR Assistant",40000,3);


-- crate employee's info 
-- insert managers info
INSERT INTO employees(first_name, last_name,role_id)
VALUES("Christian",	"Young", 1 );

INSERT INTO employees(first_name, last_name,role_id)
VALUES("Lisa","Lyman", 2 );

INSERT INTO employees(first_name, last_name,role_id)
VALUES("Warren",	"Davidson", 3 );

-- insert staff info
INSERT INTO employees(first_name, last_name,role_id,manager_id)
VALUES("Lisa","Harris", 4, 1 );
INSERT INTO employees(first_name, last_name,role_id,manager_id)
VALUES("Brandon","Stewart", 4, 1 );
INSERT INTO employees(first_name, last_name,role_id,manager_id)
VALUES("Sarah","Edmunds", 5, 1 );
INSERT INTO employees(first_name, last_name,role_id,manager_id)
VALUES("Max","Campbell", 6, 1 );

INSERT INTO employees(first_name, last_name,role_id,manager_id)
VALUES("Deirdre","Gill", 7, 2 );
INSERT INTO employees(first_name, last_name,role_id,manager_id)
VALUES("Adam","George", 8, 2 );
INSERT INTO employees(first_name, last_name,role_id,manager_id)
VALUES("Boris",	"Alsop", 9, 2 );
INSERT INTO employees(first_name, last_name,role_id,manager_id)
VALUES("Amy",	"Alsop", 9, 2 );

INSERT INTO employees(first_name, last_name,role_id,manager_id)
VALUES("Benjamin","King", 10, 3 );
INSERT INTO employees(first_name, last_name,role_id,manager_id)
VALUES("Ella","MacLeod", 11, 3 );
INSERT INTO employees(first_name, last_name,role_id,manager_id)
VALUES("Rachel","McGrath", 11, 3 );
INSERT INTO employees(first_name, last_name,role_id,manager_id)
VALUES("Mary",	"Lyman", 12, 3 );
INSERT INTO employees(first_name, last_name,role_id,manager_id)
VALUES("Adam","George", 12, 3 );

