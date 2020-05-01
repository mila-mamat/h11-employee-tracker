const inquirer = require("inquirer");
const listing = require("./listing");

async function updateBySelection(connection, callback) {
    //callBack function is selectActin(), heading back to the start of the employee tracker
    let answer = await inquirer.prompt({
        name: "selection",
        type: "list",
        message: "What would you like to update?",
        choices: ["Employee Info", "Department Info", "Role Info", "EXIT"],
    });

    switch (answer.selection) {
        case "New Employee":
            answer = await inquirer.prompt([{
                    name: "first_name",
                    type: "input",
                    message: "First name of the employee:",
                    validate: (value) => value != "",
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "Last name of the employee:",
                    validate: (value) => value != "",
                },
                {
                    name: "role_id",
                    type: "input",
                    message: "Role ID of the employee:",
                    validate: (value) => !isNaN(value),
                },
                {
                    name: "manager_id",
                    type: "input",
                    message: "Manager's ID of the employee:",
                    validate: (value) => !isNaN(value),
                },
            ]);

            await connection.query("INSERT INTO employees SET ?", {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id,
                manager_id: answer.manager_id,
            });

            console.log("Employee was added successfully!");
            await callback();






            

        case "Department Info":
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
            await connection.query("UPDATE departments SET ? WHERE ?", [{
                    name: answer.newName,
                },
                {
                    name: answer.department,
                },
            ]);

            console.log("Department was updated successfully!");
            await callback();








        case "Role Info":
            answer = await inquirer.prompt([{
                    name: "role",
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
            await connection.query("UPDATE departments SET ? WHERE ?", [{
                    name: answer.newName,
                },
                {
                    name: answer.department,
                },
            ]);

            await connection.query("INSERT INTO roles SET ?", {
                title: answer.title,
                salary: answer.salary,
                department_id: answer.department_id,
            });

            console.log("Role was added successfully!");
            await callback();

        default:
            return process.exit();
    }
}

module.exports = updateBySelection;