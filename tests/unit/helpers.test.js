const { getLicenseValidity, transformArrayToString } = require('../../src/helpers/utils');

const it = require('ava').default;
const expect = require('chai').default;
const sinon = require('sinon');

// // hint useFakeTimer
// it("getLicenseValidity", () => {
//     getLicenseValidity()
// })

// Define the test cases
it('transformArrayToString - Happy Scenario', (t) => {
  const delimiter = '-';
  const array = ['apple', 'banana', 'cherry'];
  const result = transformArrayToString(delimiter, array);
  const expected = 'apple-banana-cherry';
  t.is(result, expected);
});

it('transformArrayToString - invalid delimiter', (t) => {
  const delimiter = 123;
  const array = ['apple', 'banana', 'cherry'];
  const error = t.throws(() => transformArrayToString(delimiter, array));
  t.is(error.message, 'invalid delimeter');
});

it('transformArrayToString - empty array', (t) => {
  const delimiter = ',';
  const array = [];
  const result = transformArrayToString(delimiter, array);
  const expected = undefined;
  t.is(result, expected);
});

it('transformArrayToString - invalid delimiter (using sinon)', (t) => {
  const delimiter = 123;
  const array = ['apple', 'banana', 'cherry'];
  const spy = sinon.spy(Array.prototype, 'join');
  const error = t.throws(() => transformArrayToString(delimiter, array));
  t.is(error.message, 'invalid delimeter');
  sinon.assert.notCalled(spy);
});

// Set up the test suite
sinon.assert.expose(chai.assert, { prefix: "" });

// Test the "happy" scenario
it('returns "valid" if license is valid', t => {
    const clock = sinon.useFakeTimers(new Date('2023-01-01').getTime());
    const result = getLicenseValidity();
    expect(result).to.equal('valid');
    sinon.assert.match(clock.now, new Date('2023-01-01').getTime());
    clock.restore();
    t.pass();
});

// Test the "negative" scenario
it('returns "invalid" if license is expired', t => {
    const clock = sinon.useFakeTimers(new Date('2026-01-01').getTime());
    const result = getLicenseValidity();
    expect(result).to.equal('invalid');
    sinon.assert.match(clock.now, new Date('2026-01-01').getTime());
    clock.restore();
    t.pass();
});
