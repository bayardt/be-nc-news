const db = require("../db/connection");

exports.selectUsers = (authorUsername) => {
    console.log(authorUsername = null)
    if (!authorUsername) return db.query("SELECT * FROM users;").then(({ rows }) => rows);
    return db.query(`SELECT * FROM users WHERE username = '${authorUsername}';`).then(({ rows }) => rows);    
};