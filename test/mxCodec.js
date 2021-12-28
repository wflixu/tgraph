import { mxCodec } from "../graph/io/mxCodec.js";


var obj = new Object();
 obj.foo = "Foo";
 obj.bar = "Bar";
  var enc = new mxCodec();
  var node = enc.encode(obj);
  console.log(node);

