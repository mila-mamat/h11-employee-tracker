async function listing(connection, target, info) {
  const [list] = await connection.query(`SELECT ${info} FROM ${target} ORDER BY ${info}`);
  return list.map(item => Object.values(item)[0])
}

module.exports = listing;