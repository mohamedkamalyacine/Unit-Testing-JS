const logger = require('../../src/helpers/logger');
const Car = require('../../src/models/Car');
const utils = require('../../src/helpers/utils');
const { updateCar } = require('../../src/controllers/carController');
const startDB = require('../../src/helpers/startDB');
const sinon = require('sinon');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { expect } = require('chai');
const crypto = require('crypto');
const it = require('ava');
const sinonit = require('sinon-it')(sinon);

it.before(async (t) => {
  t.context.mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = t.context.mongod.getUri("iti43-it");
  await startDB();
});



it.after.always(async (t) => {
  await t.context.mongod.stop({ doCleanup: true });
});

const itTitle = 'should update existing car and return updated data';
const wrappedit = sinonit(async (t) => {
  const request = {
    params: {
      id: crypto.randomUUID()
    },
    body: {
      title: 'BMW',
      tags: ['new', '1500cc', 'high line'],
      price: 2500000,
    },
  };
  const stub = sinon.stub(Car, 'findByIdAndUpdate').resolves(request.body);
  const actualResult = await updateCar(request);
  const expectedId = request.params.id;
  const expectedUpdateData = { ...request.body };
  const expectedOptions = { new: true };
  t.assert(stub.calledOnceWithExactly(expectedId, expectedUpdateData, expectedOptions), 'Car.findByIdAndUpdate() was not called with the expected arguments');
  expect(actualResult).to.deep.equal(request.body);
});
