const inquirer = require("inquirer");
const listing = require("./listing");
const validate = require("./validate")

async function deleteBySelection(connection) {
    let answer;
    let condition;

    //ask for the target to delete
    answer = await inquirer.prompt({
        name: "target",
        type: "list",
        message: "What would you like to delete?",
        choices: ["Employees", "Departments", "Roles", "Back", "EXIT"],
    });

    const target = answer.target

    // prompt different questions based on the target selected
    switch (answer.target) {
        //delete employee
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


            //check if the employee exists or more than one employee matches, if not valid, restart delete function
            employee = await validate.validateEmployee(employee)
            if (!employee) return deleteBySelection(connection)

            //save employee identity
            condition = {
                id: employee[0].id
            };
            break;

        //delete department
        case "Departments":
            answer = await inquirer.prompt({
                name: "name",
                type: "list",
                message: "Which department you would like to delete?",
                choices: await listing(connection, "departments","name"),
            });
            //save the department identity
            condition = {
                name: answer.name
            };
            break;

        //delete roles 
        case "Roles":
            answer = await inquirer.prompt({
                name: "title",
                type: "list",
                message: "Which role you would like to delete?",
                choices: await listing(connection, "roles","title"),
            });

            //save the answers and role's identity
            condition = {
                title: answer.title
            };
            break;

        case "Back":
            return

        default:
            return process.exit();
    }

    
    // delete the info in the tables accordingly
    await connection.query(`DELETE FROM ${target} WHERE ?`, [condition]);
    console.log(`${target.substring(0, target.indexOf("s"))} was deleted successfully!`);
    console.log("\n --------------------------------------------------\n");


    // ask if the user wants to delete another one, if yes, repeat the flow above
    answer = await inquirer.prompt({
        name: "confirm",
        type: "list",
        message: "Would you like to delete another one?",
        choices: ["Yes", "No"],
    });
    if (answer.confirm === "Yes") {
        await deleteBySelection(connection);
    }
}

module.exports = deleteBySelection;