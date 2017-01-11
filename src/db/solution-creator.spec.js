const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

test('solution creator', t => {

  t.test('should create a new solution model and call save', assert => {

    assert.plan(7);

    const fakeData = {
      fact_find_id: 'a fake fact find id',
      solution: 'a fake solution',
      suitability_report: 'a fake susuitability report',
      statement_of_fact: 'a fake statement of fact',
      solution_summary: 'a fake solution summary',
    };

    const fakeSave = sinon.spy();

    function solutionStub(schema) {
      assert.equal(schema.fact_find_id, fakeData.fact_find_id);
      assert.equal(schema.solution, fakeData.solution);
      assert.equal(schema.suitability_report, fakeData.suitability_report);
      assert.equal(schema.statement_of_fact, fakeData.statement_of_fact);
      assert.equal(schema.solution_summary, fakeData.solution_summary);

      this.save = fakeSave;
    }

    const target = proxyquire('./solution-creator', { './solution-model': solutionStub });

    target(fakeData);

    assert.true(fakeSave.calledWithExactly());
    assert.true(fakeSave.calledOnce);

  });

});
