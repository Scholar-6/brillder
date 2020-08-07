import React from 'react';
import { render, screen } from '@testing-library/react';

import BellButton from './BellButton';

describe('bell button', () => {
  it("should display bell button with number with orange text", () => {
    let number = 14534;
    render(
      <BellButton notificationCount={number} onClick={() => {}} />
    );

    const commentText = screen.queryByText(number.toString());
    expect(commentText).toBeVisible();
  });
});