const db = require("../db/connection");

exports.selectUsers = (username = null) => {
  if (!username)
    return db.query("SELECT * FROM users;").then(({ rows }) => rows);
  return db
    .query(`SELECT * FROM users WHERE username = '${username}'`)
    .then(({ rows }) => rows);
};
