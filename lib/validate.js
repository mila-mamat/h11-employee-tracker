const inquirer = require("inquirer");

const validateEmployee = async function (employee) {
    if (!employee.length) {
        console.log("Employee Doesn't exits.")
        return false
    } else if (employee.length > 1) {
        console.log("Found more than 1 employee.\n")
        console.log("--------------------------------------------------");
        //print out employees for users to choose from
        employee.forEach(element => {
            choiceStr = JSON.stringify(element)
            console.log(choiceStr.substring(1, choiceStr.length - 1).replace(/\"/g, '') + "\n")
        });
        console.log("--------------------------------------------------");
        // ask for user selection
        selection = await inquirer.prompt({
            name: "id",
            type: "input",
            message: "please enter the ID of the employee:",
        });
        employee.unshift(employee.find(element => element.id == selection.id))
        return employee
    }
}

//check if the manager ID, role ID, department ID user entered exists
const isIDExist = function (value, list) {
    return (!isNaN(value) && list.includes(parseInt(value, 10)))
}


module.exports = {
    validateEmployee,
    isIDExist
}