# even-flatter [![Build Status](https://secure.travis-ci.org/achselschweisz/even-flatter.png?branch=master)](http://travis-ci.org/achselschweisz/even-flatter)

Take a nested Javascript object and flatten it, or unflatten an object with delimited keys.

## Installation

```bash
$ npm install even-flatter
```

## API

### flatten(original, options)

- `@param {Object} original`
- `@param {?Object=} options` @see [Options](#options)

Flattens the object - it'll return an object one level deep, regardless of how nested the original object was:

```javascript
var flatten = require('even-flatter').flatten;

flatten({
    key1: {
        keyA: 'valueI'
    },
    key2: {
        keyB: 'valueII'
    },
    key3: { a: { b: { c: 2 } } }
})

// {
//   'key1.keyA': 'valueI',
//   'key2.keyB': 'valueII',
//   'key3.a.b.c': 2
// }
```

### unflatten(original, options)

- `@param {Object} original`
- `@param {?Object=} options` @see [Options](#options)

Flattening is reversible too, you can call `flatten.unflatten()` on an object:

```javascript
var unflatten = require('even-flatter').unflatten

unflatten({
    'three.levels.deep': 42,
    'three.levels': {
        nested: true
    }
})

// {
//     three: {
//         levels: {
//             deep: 42,
//             nested: true
//         }
//     }
// }
```

## []()Options

### delimiter

Use a custom delimiter for (un)flattening your objects, instead of `.`.

### safe

When enabled, both `flat` and `unflatten` will preserve arrays and their contents. This is disabled by default.

```javascript
const flatten = require('even-flatter').flatten;

flatten({
    this: [
        { contains: 'arrays' },
        { preserving: {
              them: 'for you'
        }}
    ]
}, {
    safe: true
});

// {
//     'this': [
//         { contains: 'arrays' },
//         { preserving: {
//             them: 'for you'
//         }}
//     ]
// }
```

### object

When enabled, arrays will not be created automatically when calling unflatten, like so:

```javascript
const unflatten = require('even-flatter').unflatten;

unflatten({
  'hello.you.0': 'ipsum',
  'hello.you.1': 'lorem',
  'hello.other.world': 'foo'
}, {
  object: true
});

// hello: {
//     you: {
//         0: 'ipsum',
//         1: 'lorem',
//     },
//     other: { world: 'foo' }
// }
```

### overwrite

When enabled, existing keys in the unflattened object may be overwritten if they cannot hold a newly encountered nested value:

```javascript
const unflatten = require('even-flatter').unflatten;

unflatten({
    'TRAVIS': 'true',
    'TRAVIS_DIR': '/home/travis/build/kvz/environmental'
}, {
  overwrite: true
});

// TRAVIS: {
//     DIR: '/home/travis/build/kvz/environmental'
// }
```

Without `overwrite` set to `true`, the `TRAVIS` key would already have been set to a string, thus could not accept the nested `DIR` element.

This only makes sense on ordered arrays, and since we're overwriting data, should be used with care.

### maxDepth

Maximum number of nested objects to flatten.

```javascript
const flatten = require('even-flatter');

flatten({
    key1: {
        keyA: 'valueI'
    },
    key2: {
        keyB: 'valueII'
    },
    key3: { a: { b: { c: 2 } } }
}, {
  maxDepth: 2
});

// {
//   'key1.keyA': 'valueI',
//   'key2.keyB': 'valueII',
//   'key3.a': { b: { c: 2 } }
// }
```

### noFlattenKeys

`flatten` function only.

Provide a list of (object) keys which will not be flattened. _Nested keys_ must contain the same delimiter as configured for the flattening action.

```javascript
var flatten = require('even-flatter').flatten;

flatten({
    foo: {
        bar: 'valueI',
        foo: {
          barfoo: true
        }
    },
    cider: {
        colour: 'yellow',
        apples: {
          colour: 'green',
          mouldy: 'probably'
        },
        yellow: 'snow'
    }
}, {
  noFlattenKeys: ['foo', 'cider.apples']
});


// {
//   foo: {
//     bar: 'valueI',
//     foo: {
//       barfoo: true
//     }
//   },
//   'cider.colour': 'yellow',
//   'cider.apples': {
//     colour: 'green',
//     mouldy: 'probably'
//   },
//   'cider.yellow': 'snow'
// }
```

## Tests

```bash
npm test
firefox coverage/lcov-report/index.html
```

### Coverage

```
Statements   : 100% ( 57/57 )
Branches     : 98.21% ( 55/56 )
Functions    : 100% ( 4/4 )
Lines        : 100% ( 57/57 )
```
