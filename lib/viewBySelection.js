async function viewBySelection(connection) {
    //ask 
    let answer = await inquirer.prompt([{
            name: "target",
            type: "list",
            message: "What would you like to View?",
            choices: [
                "View all employees",
                "View employees by department",
