import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import mockAxios from 'axios';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import { createMemoryHistory } from 'history';

import InvestigationBuildPage from './investigationBuildPage';
import { Router } from 'react-router-dom';

const middlewares = [thunkMiddleware];
const mockStore = configureMockStore(middlewares);

describe("Invetigation Build Page", () => {
  it("should display a Investigation Build Page", () => {
    const store = mockStore({
      user: {
        user: {
          roles: []
        }
      },
      brick: {
        brick: {
          id: 1
        }
      }
    });

    let match = {
      params: {
        brickId: 1
      }
    }

    const history = createMemoryHistory();

    const { container } = render(
      <Router history={history}>
        <Provider store={store}>
          <InvestigationBuildPage
            shown={true}
            match={match}
            history={history}
            handleClose={() => { }}
          />
        </Provider>
      </Router>
    );

    expect(container.firstChild).toHaveClass('investigation-build-page');
  });
})