const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const { buildQuery, buildProjection } = require('../../../src/db/helpers');

test('build query', t => {

  t.test('should pick items from whitelist', assert => {

    assert.plan(1);

    const fakeWhitelist = ['wanted', 'also_wanted'];
    const fakeQuery = {
      wanted: 'fake wanted value',
      not_wanted: 'definitely not wanted',
    };

    const target = buildQuery(fakeWhitelist);

    const result = target(fakeQuery);

    const expectedQuery = {
      wanted: 'fake wanted value',
    };

    assert.deepEqual(result, expectedQuery);

  });

  t.test('should assign multiple values to $in', assert => {

    assert.plan(1);

    const fakeWhitelist = ['wanted'];
    const fakeQuery = {
      wanted: 'fake,wanted,value',
    };

    const target = buildQuery(fakeWhitelist);

    const result = target(fakeQuery);

    const expectedQuery = {
      wanted: {
        $in: ['fake', 'wanted', 'value'],
      },
    };

    assert.deepEqual(result, expectedQuery);

  });

  t.test('should handle empty whitelist and empty query', assert => {

    assert.plan(1);

    const fakeWhitelist = null;
    const fakeQuery = null;

    const target = buildQuery(fakeWhitelist);

    const result = target(fakeQuery);

    const expectedQuery = {};

    assert.deepEqual(result, expectedQuery);

  });

});

test('build projection', t => {

  t.test('should pick items from whitelist', assert => {

    assert.plan(1);

    const fakeWhitelist = ['fake', 'we_want'];
    const fakeFields = 'fake,fields,we_want';

    const target = buildProjection(fakeWhitelist);

    const result = target(fakeFields);

    const expectedProjection = {
      fake: 1,
      we_want: 1,
    };

    assert.deepEqual(result, expectedProjection);

  });

  t.test('should handle empty whitelist and empty fields', assert => {

    assert.plan(1);

    const fakeWhitelist = null;
    const fakeFields = null;

    const target = buildProjection(fakeWhitelist);

    const result = target(fakeFields);

    const expectedProjection = {};

    assert.deepEqual(result, expectedProjection);

  });

});

test('write file', t => {

  t.test('should call grid with mongoose connection details', assert => {

    assert.plan(1);

    const fakeDb = 'fake db';
    const fakeMongo = 'fake mongo';

    const { writeFile } = proxyquire('../../../src/db/helpers', {
      'gridfs-stream': (db, mongo) => {
        const actual = { db, mongo };
        const expected = { db: fakeDb, mongo: fakeMongo };

        assert.deepEqual(actual, expected,
          'should call grid with mongoose connection details');

        return { createWriteStream: () => ({}) };
      },
      mongoose: { connection: { db: fakeDb }, mongo: fakeMongo },
    });

    const target = writeFile;

    target();

  });

  t.test('should create write stream with filename', assert => {

    assert.plan(1);

    const fakeFilename = 'fake filename';

    const { writeFile } = proxyquire('../../../src/db/helpers', {
      'gridfs-stream': () => ({
        createWriteStream: ({ filename }) => {
          const actual = filename;
          const expected = fakeFilename;

          assert.equal(actual, expected,
            'should create write stream with filename');

          return {};
        },
      }),
      mongoose: { connection: {} },
    });

    const target = writeFile;

    target(fakeFilename);

  });

  t.test('should provide onClose hook for promise resolution', assert => {

    assert.plan(1);

    const fakeId = 'fake id';
    const fakeFile = { _id: fakeId };

    const mockEvents = {
      close: cb => cb(fakeFile),
    };

    const { writeFile } = proxyquire('../../../src/db/helpers', {
      'gridfs-stream': () => ({
        createWriteStream: () => ({
          on: (type, cb) => mockEvents[type](cb),
        }),
      }),
      mongoose: { connection: {} },
    });

    const target = writeFile;

    target().onClose(id => {
      const actual = id;
      const expected = fakeId;

      assert.equal(actual, expected,
        'should provide onClose hook for promise resolution');
    });

  });

});

test('read file', t => {

  t.test('should call grid with mongoose connection details', assert => {

    assert.plan(1);

    const fakeDb = 'fake db';
    const fakeMongo = 'fake mongo';

    const { readFile } = proxyquire('../../../src/db/helpers', {
      'gridfs-stream': (db, mongo) => {
        const actual = { db, mongo };
        const expected = { db: fakeDb, mongo: fakeMongo };

        assert.deepEqual(actual, expected,
          'should call grid with mongoose connection details');

        return { createReadStream: () => ({}) };
      },
      mongoose: { connection: { db: fakeDb }, mongo: fakeMongo },
    });

    const target = readFile;

    target();

  });

  t.test('should create read stream with id', assert => {

    assert.plan(1);

    const fakeId = 'fake id';

    const { readFile } = proxyquire('../../../src/db/helpers', {
      'gridfs-stream': () => ({
        createReadStream: ({ _id }) => {
          const actual = _id;
          const expected = fakeId;

          assert.equal(actual, expected,
            'should create read stream with id');

          return {};
        },
      }),
      mongoose: { connection: {} },
    });

    const target = readFile;

    target(fakeId);

  });

  t.test('should return read stream', assert => {

    assert.plan(1);

    const fakeReadStream = 'fake read stream';

    const { readFile } = proxyquire('../../../src/db/helpers', {
      'gridfs-stream': () => ({
        createReadStream: () => fakeReadStream,
      }),
      mongoose: { connection: {} },
    });

    const target = readFile;

    const actual = target();
    const expected = fakeReadStream;

    assert.equal(actual, expected,
      'should return read stream');

  });

});
