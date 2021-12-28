// import { mxCodec } from './mxCodec.js';
const { mxCodec } = require('./mxCellCodec.js');

console.log(node);
test('adds 1 + 2 to equal 3', () => {
  var obj = new Object();
  obj.foo = 'Foo';
  obj.bar = 'Bar';
  var enc = new mxCodec();
  var node = enc.encode(obj);
  expect(1 + 2).toBe(3);
});
