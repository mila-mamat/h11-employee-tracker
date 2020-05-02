const inquirer = require("inquirer");
const listing = require("./listing");
const cTable = require('console.table');


async function viewBySelection(connection) {
    let response;

    //ask user for target
    let answer = await inquirer.prompt([{
            name: "target",
            type: "list",
            message: "What would you like to View?",
            choices: [
                "View all employees",
                "View employees by department",
                "View employees by role",
                "View departments",
                "View roles",
                "Back",
                "EXIT",
            ],
        },
        {
            name: "department",
            type: "list",
            message: "Which department employees you would like to view?",
            choices: await listing(connection, "departments", "name"),
            when: (answer) => answer.target === "View employees by department",
        },
        {
            name: "role",
            type: "list",
            message: "Which department employees you would like to view?",
            choices: await listing(connection, "roles", "title"),
            when: (answer) => answer.target === "View employees by role",
        },
    ]);

    switch (answer.target) {
        case "View all employees":
            [response] = await connection.query(`${select} ORDER BY id`);
            break;

        case "View employees by department":
            [response] = await connection.query(`${select} WHERE d.name = '${answer.department}'`);
            break;

        case "View employees by role":
            [response] = await connection.query(`${select} WHERE r.title = '${answer.role}'`);
            break;

        case "View departments":
            [response] = await connection.query("SELECT * FROM departments");
            break;

        case "View roles":
            [response] = await connection.query("SELECT * FROM roles");
            break;
        case "Back":
            return
        default:
            return process.exit();
    }

    console.table("\n",response);
    console.log("\n --------------------------------------------------\n");
}

const select = `SELECT e.id, e.first_name AS "first name",e.last_name AS "last name",
    r.title,d.name AS department,r.salary,CONCAT(m.first_name," ",m.last_name) AS manager
FROM employees AS e
LEFT JOIN roles AS r ON e.role_id=r.id
LEFT JOIN  departments AS d ON r.department_id = d.id
LEFT JOIN employees AS m ON e.manager_id = m.id `;

module.exports = viewBySelection;