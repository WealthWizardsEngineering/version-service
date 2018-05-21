const { DEAD, HEALTHY } = require('../health-statuses');
const co = require('co');

module.exports = (name, options = {}) => {
  const {
    model,
  } = options;
  return co(function* process() {
    yield model.find().limit(1);
    return {
      name,
      status: HEALTHY,
    };
  })
  .catch((err) => (
    {
      name,
      status: DEAD,
      details: err
    }
  ));
};
