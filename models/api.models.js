const fs = require("fs/promises");

exports.getApiEndpoints = () => {
  return fs.readFile("./endpoints.json").then((jsonEndpoints) => {
    const endpoints = JSON.parse(jsonEndpoints)
    return endpoints;
  });
};
