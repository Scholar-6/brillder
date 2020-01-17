import types from './types';

function createBrick() {
  return {
    type: types.CREATE_BRICK
  };
}

export default {
  createBrick
}