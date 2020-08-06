import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';

import BellButton from './BellButton';

describe('comment item', () => {
  afterEach(cleanup);

  it("should display the reply and delete buttons if author", () => {
    const createComment = jest.fn();

    render(<BellButton notificationCount={1} onClick={() => {}} />);

    let dd = document.getElementById("bell-container");
  });
});