const { selectUsers } = require("../models/users.models")

exports.getUsers = (req, res, next) => {
    const {username} = req.query
    selectUsers(username)
        .then((users) => {
            res.status(200).send({ users });
        })
        .catch(next);
}