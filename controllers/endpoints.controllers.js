const {selectEndpoints} = require("../models/endpoints.models")

exports.getEndpoints = (req, res, next) => {
    return selectEndpoints()
    .then((endpoints) =>
        res.status(200).send({endpoints}))
    .catch(next);
}