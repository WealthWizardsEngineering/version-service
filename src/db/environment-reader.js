const ApplicationVersion = require('./application-version-model');

const getEnvironments = (query, projection) => {
    applications_promise = ApplicationVersion
      .find(query)
      .distinct('application_name')
      .exec();
    another_promise = applications_promise.then (function (applications) {
      return new Promise ( function (resolve, reject) {
        var async = require('async');
        async.map(applications, function(item, cb) {
          ApplicationVersion.find()
            .where('environment', query.environment)
            .where('application_name', item)
            .where('date').lte(new Date())
            .sort('-date')
            .limit(1)
            .exec(function(err, results) {
              console.log(results)
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

module.exports = {
  getEnvironments,
};
