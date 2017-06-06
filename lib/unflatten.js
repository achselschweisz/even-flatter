'use strict';


function unflatten(target, opts) {
  opts = opts || {};

  const delimiter = opts.delimiter || '.';
  const overwrite = opts.overwrite || false;
  const result = {};

  const isbuffer = Buffer.isBuffer(target);
  if (isbuffer || Object.prototype.toString.call(target) !== '[object Object]') {
    return target;
  }

  // safely ensure that the key is
  // an integer.
  const getkey = (key) => {
    const parsedKey = Number(key);
    return isNaN(parsedKey) || key.indexOf('.') !== -1 ? key : parsedKey;
  };

  const keys = Object.keys(target);

  for (const key of keys) {
    const split = key.split(delimiter);
    let key1 = getkey(split.shift());
    let key2 = getkey(split[0]);
    let recipient = result;

    while (key2 !== undefined) {
      const type = Object.prototype.toString.call(recipient[key1]);
      const isobject = type === '[object Object]' || type === '[object Array]';

      // do not write over falsey, non-undefined values if overwrite is false
      if (!overwrite && !isobject && typeof recipient[key1] !== 'undefined') {
        return result;
      }

      if (overwrite && !isobject || !overwrite && recipient[key1] == null) {
        recipient[key1] = typeof key2 === 'number' && !opts.object ? [] : {};
      }

      recipient = recipient[key1];

      if (split.length > 0) {
        key1 = getkey(split.shift());
        key2 = getkey(split[0]);
      }
    }

    // unflatten again for 'messy objects'
    recipient[key1] = unflatten(target[key], opts);
  }

  return result;
}
module.exports = unflatten;
