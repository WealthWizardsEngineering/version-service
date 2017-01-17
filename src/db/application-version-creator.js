const ApplicationVersion = require('./application-version-model');

module.exports = ({ environment, application_name, version, product }) => {
  const f = new ApplicationVersion({
    environment,
    application_name,
    version,
    product,
  });

  return f.save();
};
