import { applyDiff, getDiff } from './diff';
import { diff } from 'deep-object-diff';

const lhs = {
  foo: {
    bar: {
      a: ['a', 'b'],
      b: 2,
      c: ['x', 'y'],
      e: 100 // deleted
    }
  },
  buzz: 'world'
};


const rhs = {
  foo: {
    bar: {
      a: ['a'], // index 1 ('b')  deleted
      b: 2, // unchanged
      c: ['x', 'y', 'z', { g: 1, h: 2 }], // 'z' added
      d: 'Hello, world!' // added
    }
  },
  buzz: 'fizz' // updated
};

const objDiff = {
  foo: {
    bar: {
      a: {
        '1': undefined
      },
      c: {
        '2': 'z',
        '3': { g: 1, h: 2 }
      },
      d: 'Hello, world!',
      e: undefined
    }
  },
  buzz: 'fizz'
}

describe('diff functionality', () => {
  it('should apply the correct diff', () => {
    // arrange

    // act
    const result = applyDiff(lhs, objDiff);

    // assert
    expect(result).toStrictEqual(rhs);
  });

  it('should get the correct diff', () => {
    // arrange

    // act
    const result = diff(lhs, rhs);

    // assert
    expect(result).toStrictEqual(objDiff);
  });
})