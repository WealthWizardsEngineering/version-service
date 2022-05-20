const async = require('async');
const ApplicationVersion = require('./application-version-model');

const getEnvironment = (query, projection, id) => {
  const appsRequest = ApplicationVersion.find();
  if (query.product) {
    appsRequest.where('product', query.product);
  }
  const applications_promise = appsRequest.where('environment', id)
    .distinct('application_name')
    .exec();
  const another_promise = applications_promise.then (function (applications) {
    return new Promise ( function (resolve) {
      async.map(applications, function(item, cb) {
        const request = ApplicationVersion.find();
        request.where('environment', id);
        if (query.date) {
          request.where('date').lte(query.date);
        } else {
          request.where('date').lte(new Date());
        }
        request.where('application_name', item)
          .sort('-date')
          .limit(1)
          .exec(function(err, results) {
            if (err)
              throw err;
            if ( typeof results !== 'undefined' && results && results[0] !== 'undefined' && results[0] ) {
              cb(null, {application_name: item, version: results[0].version});
            }
            else {
              cb(null, {application_name: item, version: 'not deployed'});
            }
        });

      }, function(err, results) {
        resolve(results);
      });

    });
  });
  return another_promise
}

const getEnvironments = () => {
  return ApplicationVersion
    .find()
    .distinct('environment')
    .exec();
}

module.exports = {
  getEnvironment,
  getEnvironments,
};
