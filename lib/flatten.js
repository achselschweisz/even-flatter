'use strict';


function flatten(target, opts) {
  opts = opts || {};

  const delimiter = opts.delimiter || '.';
  const maxDepth = opts.maxDepth;
  const output = {};

  const step = (object, prev, currentDepth) => {
    currentDepth = currentDepth ? currentDepth : 1;
    const keys = Object.keys(object);

    for (const key of keys) {
      const value = object[key];
      const isarray = opts.safe && Array.isArray(value);
      const isbuffer = Buffer.isBuffer(value);

      const type = Object.prototype.toString.call(value);
      const isobject = type === '[object Object]' || type === '[object Array]';

      const newKey = prev ? prev + delimiter + key : key;

      if (!isarray && !isbuffer && isobject && Object.keys(value).length &&
          (!opts.maxDepth || currentDepth < maxDepth)) {
        step(value, newKey, currentDepth + 1);
        continue;
      }

      output[newKey] = value;
    }
  };

  step(target);

  return output;
}
module.exports = flatten;
