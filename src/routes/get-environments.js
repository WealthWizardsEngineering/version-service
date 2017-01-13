const { getEnvironments } = require('../db/environment-reader');

module.exports = (req, res) => {

  getEnvironments()
    .then(results => {
      res.send(results);
    });

};
