import { mxGraph } from '../view/mxGraph.js';
import { mxCodecRegistry } from './mxCodecRegistry.js';
import { mxObjectCodec } from './mxObjectCodec.js';

/**
 * Class: mxGraphCodec
 *
 * Codec for <mxGraph>s. This class is created and registered
 * dynamically at load time and used implicitly via <mxCodec>
 * and the <mxCodecRegistry>.
 *
 * Transient Fields:
 *
 * - graphListeners
 * - eventListeners
 * - view
 * - container
 * - cellRenderer
 * - editor
 * - selection
 */
const codec = new mxObjectCodec(new mxGraph(), [
  'graphListeners',
  'eventListeners',
  'view',
  'container',
  'cellRenderer',
  'editor',
  'selection',
]);

mxCodecRegistry.register(codec);
console.log('graph/io/mxGraphCodec.js');