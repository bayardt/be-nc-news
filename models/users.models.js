const db = require("../db/connection");

exports.selectUsers = (username = null) => {
  if (!username)
    return db.query("SELECT * FROM users;").then(({ rows }) => rows);
  return db
    .query('SELECT * FROM users WHERE username = $1', [username])
    .then(({ rows }) => rows);
};
