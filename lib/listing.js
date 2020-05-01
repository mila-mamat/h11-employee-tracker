async function listing(connection, target) {
  switch (target) {
    case "departments":
      const [departments] = await connection.query(
        `SELECT name FROM departments`
      );
      return departments.map((item) => item.name);

    case "roles":
      const [roles] = await connection.query(`SELECT title FROM roles`);
      return roles.map((item) => item.title);

  }
}

module.exports = listing;
