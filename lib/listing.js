async function listing(connection, target, ...params) {
  switch (target) {
    case "departments":
      const [departments] = await connection.query(
        `SELECT name FROM departments`
      );
      return departments.map((item) => item.name);

    case "roles":
      const [roles] = await connection.query(`SELECT title FROM roles`);
      return roles.map((item) => item.title);

    case "employee":
      const [info] = await connection.query(
        `SELECT first_name, last_name,role_id,manager_id FROM employees WHERE ? AND ?`,[
            { first_name: params[0] },
             { last_name: params[1] }]
      );
      return info;
  }
}

module.exports = listing;
