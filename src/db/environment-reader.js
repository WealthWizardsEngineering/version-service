const ApplicationVersion = require('./application-version-model');

const getEnvironment = (query, projection, id) => {
  applications_promise = ApplicationVersion.find()
    .where('environment', id)
    .distinct('application_name')
    .exec();
  another_promise = applications_promise.then (function (applications) {
    return new Promise ( function (resolve, reject) {
      var async = require('async');
      async.map(applications, function(item, cb) {
        request = ApplicationVersion.find();
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
            if (err) throw err;
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
