const fs = require('fs/promises')

exports.selectEndpoints = () => {
    return fs.readFile('./endpoints.json', 'utf-8')
    .then((unparsedEndpoints) => {
        return JSON.parse(unparsedEndpoints)
    })
}