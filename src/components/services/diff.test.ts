import { applyDiff, Diff, getDiff } from './diff';

const lhs = {
  foo: {
    bar: {
      a: ['a', 'b'],
      b: 2,
      c: ['x', 'y', { g: 1, h: 2 }],
      e: 100 // deleted
    }
  },
  buzz: 'world'
};

const rhs = {
  foo: {
    bar: {
      a: ['b'], // index 0 ('a')  deleted
      b: 2, // unchanged
      c: ['x', 'y', 'z', { g: 2, h: 2 }], // 'z' added, { g: 2 } updated
      d: 'Hello, world!' // added
    }
  },
  buzz: 'fizz' // updated
};

type MockData = typeof lhs | typeof rhs;

const objDiff: Diff<MockData> = {
  foo: {
    bar: {
      a: {
        '0': 'b',
        '1': null
      },
      c: {
        '2': 'z',
        '3': { g: 2, h: 2 }
      },
      d: 'Hello, world!',
      e: null
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
    const result = getDiff<MockData>(lhs, rhs);

    // assert
    expect(result).toStrictEqual(objDiff);
  });
})