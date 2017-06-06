'use strict';
const flatten = require('./flatten');
const unflatten = require('./unflatten');

flatten.unflatten = unflatten;


module.exports = {
  flatten,
  unflatten
};

// var flat = module.exports = flatten
// flatten.flatten = flatten
// flatten.unflatten = unflatten
