const ApplicationVersion = require('./application-version-model');

module.exports = ({ environment, application_name, version }) => {
  const f = new ApplicationVersion({
    environment,
    application_name,
    version,
  });

  return f.save();
};
