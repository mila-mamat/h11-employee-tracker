const inquirer = require('inquirer')
const mysql = require('mysql2/promise')
const viewBySelection = require('./lib/viewBySelection')
const addBySelection = require('./lib/addBySelection')
const updateBySelection = require('./lib/updateBySelection')

let connection

main()

async function main() {
    try {
        //connect to the database
        console.log("connecting database... ")
        await connect()
        //greetings
        console.log("\n Welcome to employee tracker \n")

        // start the employee tracker 
        await selectAction()
    } catch (error) {
        console.error(error)
    } finally {
        connection.end()
    }
}

// Pass the connection details to the MySQL driver to open a connection to the database.
async function connect() {
    connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '281561ml',
        database: 'employee_trackerDB'
    })
    console.log('connected as id ' + connection.threadId)
}

// Employee tracker will select an action(view,add, update, delete) first, and the select target (employee, role, department)
async function selectAction() {
    const answer = await inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'Would you like to do?',
        choices: ['View Employees/Departments/Roles', 'Add Employees/Departments/Roles', 'Update Employees/Departments/Roles', 'Delete Employees/Departments/Roles', 'EXIT']
    })

    // Based on the answer, call different actions
    switch (answer.action) {
        case 'View Employees/Departments/Roles':
            await viewBySelection(connection);
            return selectAction()
        case 'Add Employees/Departments/Roles':
            await addBySelection(connection);
            return selectAction()
        case 'Update Employees/Departments/Roles':
            await updateBySelection(connection);
            return selectAction()
        case 'Delete Employees/Departments/Roles':
            await deleteBySelection(connection);
            return selectAction()
        default:
            return process.exit()
    }
}