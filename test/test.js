'use strict';
/* global suite: false, setup: false, test: false,
    teardown: false, suiteSetup: false, suiteTeardown: false */
const assert = require('assert');
const flat = require('../index');
const flatten = flat.flatten;
const unflatten = flat.unflatten;

const primitives = {
  String: 'good morning',
  Number: 1234.99,
  Boolean: true,
  Date: new Date(),
  null: null,
  undefined: undefined
};

suite('Flatten Primitives', () => {
  Object.keys(primitives).forEach((key) => {
    var value = primitives[key];

    test(key, () => {
      assert.deepEqual(flatten({
        hello: {
          world: value
        }
      }), {
        'hello.world': value
      });
    });
  });
});

suite('Unflatten Primitives', () => {
  Object.keys(primitives).forEach((key) => {
    var value = primitives[key];

    test(key, () => {
      assert.deepEqual(unflatten({
        'hello.world': value
      }), {
        hello: {
          world: value
        }
      });
    });
  });
});

suite('Flatten', () => {
  test('Nested once', () => {
    assert.deepEqual(flatten({
      hello: {
        world: 'good morning'
      }
    }), {
      'hello.world': 'good morning'
    });
  });

  test('Nested twice', () => {
    assert.deepEqual(flatten({
      hello: {
        world: {
          again: 'good morning'
        }
      }
    }), {
      'hello.world.again': 'good morning'
    });
  });

  test('Multiple Keys', () => {
    assert.deepEqual(flatten({
      hello: {
        lorem: {
          ipsum: 'again',
          dolor: 'sit'
        }
      },
      world: {
        lorem: {
          ipsum: 'again',
          dolor: 'sit'
        }
      }
    }), {
      'hello.lorem.ipsum': 'again',
      'hello.lorem.dolor': 'sit',
      'world.lorem.ipsum': 'again',
      'world.lorem.dolor': 'sit'
    });
  });

  test('Custom Delimiter', () => {
    assert.deepEqual(flatten({
      hello: {
        world: {
          again: 'good morning'
        }
      }
    }, {
      delimiter: ':'
    }), {
      'hello:world:again': 'good morning'
    });
  });


  test('noFlattenKeys option / custom delimiter', () => {
    assert.deepEqual(flatten({
      hello: {
        world: {
          again: 'good morning'
        },
        horse: {
          goes: 'neigh neigh',
          givesMilk: false
        },
        cow: {
          goes: 'moo moo',
          dung: {
            colour: 'brownish',
            consistency: 'flappy, downright mushy'
          },
          givesMilk: true
        }
      },
      foobar: {
        barfoo: true
      }
    }, {
      delimiter: ':',
      noFlattenKeys: ['foobar', 'hello:horse', 'hello:cow:dung', 'hello:cow:givesMilk']
    }), {
      'hello:world:again': 'good morning',
      'hello:horse': {
        goes: 'neigh neigh',
        givesMilk: false
      },
      'hello:cow:goes': 'moo moo',
      'hello:cow:dung': {
        colour: 'brownish',
        consistency: 'flappy, downright mushy'
      },
      'hello:cow:givesMilk': true,
      foobar: {
        barfoo: true
      }
    });
  });


  test('Empty Objects', () => {
    assert.deepEqual(flatten({
      hello: {
        empty: {
          nested: { }
        }
      }
    }), {
      'hello.empty.nested': { }
    });
  });

  if (typeof Buffer !== 'undefined') {
    test('Buffer', () => {
      assert.deepEqual(flatten({
        hello: {
          empty: {
            nested: new Buffer('test')
          }
        }
      }), {
        'hello.empty.nested': new Buffer('test')
      });
    });
  }

  if (typeof Uint8Array !== 'undefined') {
    test('typed arrays', () => {
      assert.deepEqual(flatten({
        hello: {
          empty: {
            nested: new Uint8Array([1, 2, 3, 4])
          }
        }
      }), {
        'hello.empty.nested': new Uint8Array([1, 2, 3, 4])
      });
    });
  }

  test('Custom Depth', () => {
    assert.deepEqual(flatten({
      hello: {
        world: {
          again: 'good morning'
        }
      },
      lorem: {
        ipsum: {
          dolor: 'good evening'
        }
      }
    }, {
      maxDepth: 2
    }), {
      'hello.world': {
        again: 'good morning'
      },
      'lorem.ipsum': {
        dolor: 'good evening'
      }
    });
  });
});


suite('Unflatten', () => {
  test('Nested once', () => {
    assert.deepEqual({
      hello: {
        world: 'good morning'
      }
    }, unflatten({
      'hello.world': 'good morning'
    }));
  });

  test('Nested twice', () => {
    assert.deepEqual({
      hello: {
        world: {
          again: 'good morning'
        }
      }
    }, unflatten({
      'hello.world.again': 'good morning'
    }));
  });

  test('Multiple Keys', () => {
    assert.deepEqual({
      hello: {
        lorem: {
          ipsum: 'again',
          dolor: 'sit'
        }
      },
      world: {
        lorem: {
          ipsum: 'again',
          dolor: 'sit'
        }
      }
    }, unflatten({
      'hello.lorem.ipsum': 'again',
      'hello.lorem.dolor': 'sit',
      'world.lorem.ipsum': 'again',
      'world.lorem.dolor': 'sit'
    }));
  });

  test('Custom Delimiter', () => {
    assert.deepEqual({
      hello: {
        world: {
          again: 'good morning'
        }
      }
    }, unflatten({
      'hello world again': 'good morning'
    }, {
      delimiter: ' '
    }));
  });

  test('Unflatten partially flattened ob (previousnoFlattenKeys option / custom delim)', () => {
    assert.deepEqual(unflatten({
      'hello:world:again': 'good morning',
      'hello:horse': {
        goes: 'neigh neigh',
        givesMilk: false
      },
      'hello:cow:goes': 'moo moo',
      'hello:cow:dung': {
        colour: 'brownish',
        consistency: 'flappy, downright mushy'
      },
      'hello:cow:givesMilk': true,
      foobar: {
        barfoo: true
      }
    }, {
      delimiter: ':'
    }), {
      hello: {
        world: {
          again: 'good morning'
        },
        horse: {
          goes: 'neigh neigh',
          givesMilk: false
        },
        cow: {
          goes: 'moo moo',
          dung: {
            colour: 'brownish',
            consistency: 'flappy, downright mushy'
          },
          givesMilk: true
        }
      },
      foobar: {
        barfoo: true
      }
    });
  });



  test('Overwrite', () => {
    assert.deepEqual({
      travis: {
        build: {
          dir: '/home/travis/build/kvz/environmental'
        }
      }
    }, unflatten({
      travis: 'true',
      travis_build_dir: '/home/travis/build/kvz/environmental'
    }, {
      delimiter: '_',
      overwrite: true
    }));
  });

  test('Messy', () => {
    assert.deepEqual({
      hello: {world: 'again'},
      lorem: {ipsum: 'another'},
      good: {
        morning: {
          hash: {
            key: {nested: {
              deep: {and: {even: {
                deeper: {still: 'hello'}
              }}}
            }}
          },
          again: {testing: {'this': 'out'}}
        }
      }
    }, unflatten({
      'hello.world': 'again',
      'lorem.ipsum': 'another',
      'good.morning': {
        'hash.key': {
          'nested.deep': {
            'and.even.deeper.still': 'hello'
          }
        }
      },
      'good.morning.again': {
        'testing.this': 'out'
      }
    }));
  });


  suite('Overwrite + non-object values in key positions', () => {
    test('non-object keys + overwrite should be overwritten', () => {
      assert.deepEqual(flat.unflatten({a: null, 'a.b': 'c'}, {overwrite: true}), {a: {b: 'c'}});
      assert.deepEqual(flat.unflatten({a: 0, 'a.b': 'c'}, {overwrite: true}), {a: {b: 'c'}});
      assert.deepEqual(flat.unflatten({a: 1, 'a.b': 'c'}, {overwrite: true}), {a: {b: 'c'}});
      assert.deepEqual(flat.unflatten({a: '', 'a.b': 'c'}, {overwrite: true}), {a: {b: 'c'}});
    });

    test('overwrite value should not affect undefined keys', () => {
      assert.deepEqual(flat.unflatten({a: undefined, 'a.b': 'c'}, {overwrite: true}), {a: {b: 'c'}});
      assert.deepEqual(flat.unflatten({a: undefined, 'a.b': 'c'}, {overwrite: false}), {a: {b: 'c'}});
    });

    test('if no overwrite, should ignore nested values under non-object key', () => {
      assert.deepEqual(flat.unflatten({
        a: null,
        'a.b': 'c'
      }), {
        a: null
      });

      assert.deepEqual(flat.unflatten({
        a: 0,
        'a.b': 'c'
      }), {
        a: 0
      });

      assert.deepEqual(flat.unflatten({
        a: 1,
        'a.b': 'c'
      }), {
        a: 1
      });

      assert.deepEqual(flat.unflatten({
        a: '',
        'a.b': 'c'
      }), {
        a: ''
      });
    });
  });

  suite('.safe', () => {
    test('Should protect arrays when true', () => {
      assert.deepEqual(flatten({
        hello: [
          {world: {again: 'foo'}},
          {lorem: 'ipsum'}
        ],
        another: {
          nested: [{array: {too: 'deep'}}]
        },
        lorem: {
          ipsum: 'whoop'
        }
      }, {
        safe: true
      }), {
        hello: [
            {world: {again: 'foo'}}
          , {lorem: 'ipsum'}
        ]
        , 'lorem.ipsum': 'whoop'
        , 'another.nested': [{array: {too: 'deep'}}]
      });
    });

    test('Should not protect arrays when false', () => {
      assert.deepEqual(flatten({
        hello: [
            {world: {again: 'foo'}}
          , {lorem: 'ipsum'}
        ]
      }, {
        safe: false
      }), {
        'hello.0.world.again': 'foo',
        'hello.1.lorem': 'ipsum'
      });
    });
  });

  suite('.object', () => {
    test('Should create object instead of array when true', () => {
      var unflattened = unflatten({
        'hello.you.0': 'ipsum',
        'hello.you.1': 'lorem',
        'hello.other.world': 'foo'
      }, {
        object: true
      });
      assert.deepEqual({
        hello: {
          you: {
            0: 'ipsum',
            1: 'lorem'
          },
          other: {world: 'foo'}
        }
      }, unflattened);
      assert(!Array.isArray(unflattened.hello.you));
    });

    test('Should create object instead of array when nested', () => {
      var unflattened = unflatten({
        'hello': {
          'you.0': 'ipsum',
          'you.1': 'lorem',
          'other.world': 'foo'
        }
      }, {
        object: true
      });
      assert.deepEqual({
        hello: {
          you: {
            0: 'ipsum',
            1: 'lorem'
          },
          other: {world: 'foo'}
        }
      }, unflattened);
      assert(!Array.isArray(unflattened.hello.you));
    });

    test('Should not create object when false', () => {
      var unflattened = unflatten({
        'hello.you.0': 'ipsum',
        'hello.you.1': 'lorem',
        'hello.other.world': 'foo'
      }, {
        object: false
      });
      assert.deepEqual({
        hello: {
          you: ['ipsum', 'lorem'],
          other: {world: 'foo'}
        }
      }, unflattened);
      assert(Array.isArray(unflattened.hello.you));
    });
  });

  if (typeof Buffer !== 'undefined') {
    test('Buffer', () => {
      assert.deepEqual(unflatten({
        'hello.empty.nested': new Buffer('test')
      }), {
        hello: {
          empty: {
            nested: new Buffer('test')
          }
        }
      });
    });
  }

  if (typeof Uint8Array !== 'undefined') {
    test('typed arrays', () => {
      assert.deepEqual(unflatten({
        'hello.empty.nested': new Uint8Array([1, 2, 3, 4])
      }), {
        hello: {
          empty: {
            nested: new Uint8Array([1, 2, 3, 4])
          }
        }
      });
    });
  }
});

suite('Arrays', () => {
  test('Should be able to flatten arrays properly', () => {
    assert.deepEqual({
      'a.0': 'foo',
      'a.1': 'bar'
    }, flatten({
      a: ['foo', 'bar']
    }));
  });

  test('Should be able to revert and reverse array serialization via unflatten', () => {
    assert.deepEqual({
      a: ['foo', 'bar']
    }, unflatten({
      'a.0': 'foo',
      'a.1': 'bar'
    }));
  });

  test('Array typed objects should be restored by unflatten', () => {
    assert.equal(
        Object.prototype.toString.call(['foo', 'bar'])
      , Object.prototype.toString.call(unflatten({
        'a.0': 'foo',
        'a.1': 'bar'
      }).a)
    );
  });

  test('Do not include keys with numbers inside them', () => {
    assert.deepEqual(unflatten({
      '1key.2_key': 'ok'
    }), {
      '1key': {
        '2_key': 'ok'
      }
    });
  });
});
