const _ = require('lodash');
const mongoose = require('mongoose');
const grid = require('gridfs-stream');

/**
 * Build a mongo query by picking whitelisted fields
 * from the input query object and mapping those to
 * individual values or an array of $in values
 * @param {string[]} whitelist - The allowed query fields
 */
const buildQuery = whitelist => query =>
  _(query)
    .pick(whitelist)
    .mapValues((value) => {
      if (!("string" === typeof value) || value.indexOf(',') < 0) {
        return value;
      }

      return {
        $in: value.split(','),
      };
    })
    .value();

/**
 * Build a mongo projection by finding the intersection
 * between the array of input fields and the whitelisted
 * fields and reducing the resulting array into an object
 * where each key has the value 1
 * @param {string[]} whitelist - The allowed projection fields
 */
const buildProjection = whitelist => fields =>
  _(fields && fields.split(','))
    .intersection(whitelist)
    .reduce((accumulator, value) =>
      Object.assign({ [value]: 1 }, accumulator), {});

const writeFile = filename => {
  const gridFS = grid(mongoose.connection.db, mongoose.mongo);
  const writestream = gridFS.createWriteStream({
    filename,
  });

  writestream.onClose = resolve => {
    writestream
      .on('close', file => {
        resolve(file._id);
      });
  };

  return writestream;
};

const readFile = id => {
  const gridFS = grid(mongoose.connection.db, mongoose.mongo);
  const readstream = gridFS.createReadStream({
    _id: id,
  });

  return readstream;
}

module.exports = {
  buildQuery,
  buildProjection,
  writeFile,
  readFile,
};
