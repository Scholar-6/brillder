import React from 'react';
import { render } from '@testing-library/react';
import HomeButton from './HomeButton';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

describe("Home Button", () => {
  it("should display a Home Button", () => {
    const history = createMemoryHistory();
    
    const { container } = render(
      <Router history={history}>
        <HomeButton link={"/test"} history={history} />
      </Router>
    );

    expect(container.firstChild).toHaveClass('home-button-container');
  });
})