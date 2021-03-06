const inquirer = require("inquirer");
const validate = require("./validate")
const format  = require("./format")
const listing = require("./listing")

async function addBySelection(connection) {
    let answer
    let info


    //choose the type of info to add 
    answer = await inquirer.prompt({
        name: "target",
        type: "list",
        message: "What would you like to add?",
        choices: [
            "Employees",
            "Departments",
            "Roles",
            "Back",
            "EXIT",
        ],
    });
    const target = answer.target

    // prompt question based on the type selected and store answers into info
    switch (target) {
        case "Employees":

            answer = await inquirer.prompt([{
                    name: 'first_name',
                    type: 'input',
                    message: 'First name of the employee:',
                    validate: value => value != ""
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'Last name of the employee:',
                    validate: value => value != ""
                },
                {
                    name: 'role_id',
                    type: 'input',
                    message: 'Role ID of the employee:',
                    validate: value => validate.isIDExist(connection,value,"roles")
                },
                {
                    name: 'manager_id',
                    type: 'input',
                    message: "Manager's ID of the employee:",
                    validate: value=> validate.isIDExist(connection,value,"employees")
                }
            ])
            //save answers into info
            info = {
                first_name: format(answer.first_name),
                last_name: format(answer.last_name),
                role_id: answer.role_id,
                manager_id: answer.manager_id
            }
            break;

        case "Departments":
            answer = await inquirer.prompt({
                name: 'name',
                type: 'input',
                message: 'Name of the department:',
                validate: value => value != ""
            })
            //save answers into info
            info = {
                name: format(answer.name)
            }
            break

        case "Roles":

            answer = await inquirer.prompt([{
                    name: 'title',
                    type: 'input',
                    message: 'Title of the role:',
                    validate: value => value != ""
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'Salary of the role: ',
                    validate: value => value != ""
                },
                {
                    name: 'department_id',
                    type: 'input',
                    message: 'Department ID of this role belongs to:',
                    validate: value => validate.isIDExist(connection,value,"departments")
                }
            ])
      
            //save answers into info
            info = {
                title: format(answer.title),
                salary: answer.salary,
                department_id: answer.department_id
            }
            break
        case "Back":
            return
        default:
            return process.exit()
    }

    // insert info into tables accordingly
    await connection.query(`INSERT INTO ${target} SET ?`, [info])
    console.log(`${target.substring(0, target.indexOf("s"))} was added successfully!`)
    console.log('\n --------------------------------------------------\n')

    // ask if the user wants to add another one, if yes, repeat the flow above
    answer = await inquirer.prompt({
        name: "confirm",
        type: "list",
        message: "Would you like to add another one?",
        choices: ['Yes', 'No'],
    });
    if (answer.confirm === 'Yes') {
        await addBySelection(connection);
    }
}


module.exports = addBySelection;