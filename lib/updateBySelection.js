const inquirer = require("inquirer");
const listing = require("./listing");

async function updateBySelection(connection) {
    let answer;
    let updateInfo;
    let condition;
    //ask for the target to update
    answer = await inquirer.prompt({
        name: "target",
        type: "list",
        message: "What would you like to update?",
        choices: ["Employees Info", "Departments Info", "Roles Info", "EXIT"],
    });
    const target = answer.target.substring(0, answer.target.indexOf(" Info"));

    // prompt different questions based on the target selected
    switch (answer.target) {
        //update employee info
        case "Employees Info":
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


            //check if the employee exists or more than one employee matches
            if (!employee.length) {
                console.log("Employee Doesn't exits.")
                return updateBySelection();
            } else if (employee.length > 1) {
                console.log("Found more than 1 employee.\n")
                console.log("--------------------------------------------------");
                //print out employees info for users to choose from
                employee.forEach(element => {
                    choiceStr = JSON.stringify(element)
                    console.log(choiceStr.substring(1, choiceStr.length - 1).replace(/\"/g, '') + "\n")
                });
                console.log("--------------------------------------------------");
                // ask for user selection
                selection = await inquirer.prompt({
                    name: "id",
                    type: "input",
                    message: "please enter the ID of the employee you would like to update:",
                });
                employee.unshift(employee.find(element => element.id == selection.id))
            }

            //collect infos to update
            console.log("To keep the original value, please use default.");
            answer = await inquirer.prompt([{
                    name: "firstName",
                    type: "input",
                    message: "Update the title of role to:",
                    default: employee[0].first_name,
                    validate: (value) => value != "",
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "Update the salary of role to:",
                    default: employee[0].last_name,
                    validate: (value) => value != "",
                },
                {
                    name: "roleId",
                    type: "input",
                    message: "Update the department id of role to:",
                    default: employee[0].role_id,
                    validate: (value) => value != "",
                },
                {
                    name: "managerId",
                    type: "input",
                    message: "Update the department id of role to:",
                    default: employee[0].manager_id,
                    validate: (value) => value != "",
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
        case "Departments Info":
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
            //update roles info 
        case "Roles Info":
            answer = await inquirer.prompt({
                name: "role",
                type: "list",
                message: "Which role you would like to update?",
                choices: await listing(connection, "roles"),
            });

            //get the role info to provide as default value
            const [role] = await connection.query(`SELECT * FROM roles WHERE title = '${answer.role}'`);
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
                    validate: (value) => value != "",
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