const { HEALTHY, DEAD } = require('../health-statuses');
const pingMongo = require('../db/ping-mongo');
const Service = require('../db/application-version-model');
const resources = [
  {
    type: 'mongo',
    name: 'application version store',
    model: Service,
  },
];

const buildPromises = (resources) => {
  const promises = [];
  for (const resourceConfig of resources) {
    const {
      name,
      type,
      url,
      model,
    } = resourceConfig;

    switch (type) {
      case 'mongo':
        promises.push(pingMongo(name, { url, model }));
        break;
      default:
        break;
    }
  }
  return promises;
};

module.exports = (req, res) => {
  if (resources.length === 0) {
    res.send({ resources: [] })
  } else {
    Promise
      .all(buildPromises(resources))
      .then((results) => {
        const unhealthyService = results.find(result => result.status !== HEALTHY);

        let statusCode = 200;

        if (unhealthyService) {
          const deadServices = results.filter(result => result.status === DEAD);

          if (deadServices.length === results.length) {
            statusCode = 500;
          } else {
            statusCode = 412;
          }

          if (req.log && req.log.toInvestigateTomorrow) {
            req.log.toInvestigateTomorrow({ failures: unhealthyService }, 'Service unhealthy');
          }
        }

        res.status(statusCode).send({ resources: results });
      })
      .catch(err => {
        if (req.log && req.log.toInvestigateTomorrow) {
          req.log.toInvestigateTomorrow(err, 'Service dead');
        }

        res.status(500).end();
      });
  }
};
