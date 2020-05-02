const inquirer = require("inquirer");
const listing = require("./listing");
const validate = require("./validate")


async function updateBySelection(connection) {
    let answer;
    let updateInfo;
    let condition;
    //ask for the target to update
    answer = await inquirer.prompt({
        name: "target",
        type: "list",
        message: "What would you like to update?",
        choices: ["Employees", "Departments", "Roles", "Back", "EXIT"],
    });
    const target = answer.target;

    // prompt different questions based on the target selected
    switch (answer.target) {
        //update employee info
        case "Employees":
            answer = await inquirer.prompt([{
                name: "firstName",
                type: "input",
                message: "First name of the employee:",
            },
            {
                name: "lastName",
                type: "input",
                message: "Last name of the employee:",
            },
            ]);

            //get the employee's info to provide as default value
            let [employee] = await connection.query(`SELECT * FROM employees WHERE first_name = '${answer.firstName}' 
                AND last_name = '${answer.lastName}'`);

            //check if the employee exists or more than one employee matches, if not valid, restart the update function
            employee = await validate.validateEmployee(employee)
            if (!employee) return updateBySelection(connection)

            //collect infos to update
            console.log("To keep the original value, please use default.");
            const roleList = await listing(connection, "roles", "id")
            const managerList = await listing(connection, "employees", "id")
            answer = await inquirer.prompt([{
                name: "firstName",
                type: "input",
                message: "Update the first name of the employee to:",
                default: employee[0].first_name,
                validate: (value) => value != "",
            },
            {
                name: "lastName",
                type: "input",
                message: "Update the last name of the employee to:",
                default: employee[0].last_name,
                validate: (value) => value != "",
            },
            {
                name: "roleId",
                type: "input",
                message: "Update the role id of role to:",
                default: employee[0].role_id,
                validate: value => validate.isIDExist(value, roleList)
            },
            {
                name: "managerId",
                type: "input",
                message: "Update the manager id of role to:",
                default: employee[0].manager_id,
                validate: value => validate.isIDExist(value, managerList)
            }
            ]);
            // save the answers and employees identity
            updateInfo = {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: answer.roleId,
                manager_id: answer.managerId,
            };
            condition = {
                id: employee[0].id
            };
            break;

        //update department info
        case "Departments":
            answer = await inquirer.prompt([{
                name: "department",
                type: "list",
                message: "Which department name you would like to update?",
                choices: await listing(connection, "departments"),
            },
            {
                name: "newName",
                type: "input",
                message: "Update the name of department to:",
                validate: (value) => value != "",
            },
            ]);
            //save the answer and department identity
            updateInfo = {
                name: answer.newName
            };
            condition = {
                name: answer.department
            };
            break;
        //update roles 
        case "Roles":
            answer = await inquirer.prompt({
                name: "role",
                type: "list",
                message: "Which role you would like to update?",
                choices: await listing(connection, "roles"),
            });

            //get the role info to provide as default value
            const [role] = await connection.query(`SELECT * FROM roles WHERE title = '${answer.role}'`);
            const departmentList = await listing(connection, "departments", "id")
            console.log("To keep the original value, please use default.");
            //collect infos to update
            answer = await inquirer.prompt([{
                name: "newTile",
                type: "input",
                message: "Update the title of role to:",
                default: role[0].title,
                validate: (value) => value != "",
            },
            {
                name: "newSalary",
                type: "input",
                message: "Update the salary of role to:",
                default: role[0].salary,
                validate: (value) => value != "",
            },
            {
                name: "newDepartment",
                type: "input",
                message: "Update the department id of role to:",
                default: role[0].department_id,
                validate: value => validate.isIDExist(value, departmentList)
            },
            ]);
            //save the answers and role's identity
            updateInfo = {
                title: answer.newTile,
                salary: answer.newSalary,
                department_id: answer.newDepartment,
            };
            condition = {
                title: answer.newTile
            };
            break;
        case "Back":
            return
        default:
            return process.exit();
    }

    // update the info in the tables accordingly
    await connection.query(`UPDATE ${target} SET ? WHERE ?`, [updateInfo, condition]);
    console.log(`${target.substring(0, target.indexOf("s"))} was updated successfully!`);
    console.log("\n --------------------------------------------------\n");


    // ask if the user wants to update another one, if yes, repeat the flow above
    answer = await inquirer.prompt({
        name: "confirm",
        type: "list",
        message: "Would you like to update another one?",
        choices: ["Yes", "No"],
    });
    if (answer.confirm === "Yes") {
        await updateBySelection(connection);
    }
}

module.exports = updateBySelection;