const { selectUsers } = require("../models/users.models")

exports.getUsers = (req, res, next) => {
    const authorUsername = req.query
    selectUsers(authorUsername)
        .then((users) => {
            res.status(200).send({ users });
        })
        .catch(next);
}