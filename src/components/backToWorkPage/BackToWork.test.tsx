import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import { createMemoryHistory } from 'history';

import BackToWorkPage from './BackToWork';
import { Router } from 'react-router-dom';

const middlewares = [thunkMiddleware];
const mockStore = configureMockStore(middlewares);

describe("Back to Work Page", () => {
  it("should display a Back to Work Page", () => {
  });
});

/* 8/17/2020 working on teach in back to work
describe("Back to Work Page", () => {
  it("should display a Back to Work Page", () => {
    const store = mockStore({
      user: {
        user: { roles: [] }
      },
      notifications: {
        notifications: []
      },
    });

    const history = createMemoryHistory();

    const { container } = render(
      <Router history={history}>
        <Provider store={store}>
          <BackToWorkPage isMocked={true} bricks={[]} />
        </Provider>
      </Router>
    );

    expect(container.firstChild).toHaveClass('back-to-work-page');
  });
  it("should display a Back to Work Page with 2 bricks", () => {
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
      },
      notifications: {
        notifications: []
      }
    });

    const history = createMemoryHistory();

    let bricks = [
      {
        attemptsCount: 31,
        author: { email: "1235@i.ua", firstName: "name", id: 7, username: "name3", lastName: "lastname" },
        brickLength: 60,
        brief: "To introduce the chemistry and practical techniques associated with the oxidation of alcohols",
        created: "2020-03-17T00:00:00.000Z",
        editor: { email: "admin@test.com", firstName: "admin", id: 16, username: "admin4", lastName: "admin2" },
        id: 131,
        locked: false,
        openQuestion: "N/Aa",
        prep: "",
        questions: [],
        revisionLog: null,
        status: 4,
        subject: { id: 12, name: "History", color: "#D4AC65", checked: false, bricksCount: 0, publishedBricksCount: 0 },
        subjectId: 12,
        synthesis: "",
        title: "Alcohol Fuelled Cars – The Oxidation of Alcohols",
        topic: "",
        updated: "2020-07-20T12:33:44.000Z",
      },
      {
        attemptsCount: 31,
        author: { email: "1235@i.ua", firstName: "name", id: 7, username: "name3", lastName: "lastname" },
        brickLength: 60,
        brief: "To introduce the chemistry and practical techniques associated with the oxidation of alcohols",
        created: "2020-03-17T00:00:00.000Z",
        editor: { email: "admin@test.com", firstName: "admin", id: 16, username: "admin4", lastName: "admin2" },
        id: 132,
        locked: false,
        openQuestion: "N/Aa",
        prep: "",
        questions: [],
        revisionLog: null,
        status: 4,
        subject: { id: 12, name: "History", color: "#D4AC65", checked: false, bricksCount: 0, publishedBricksCount: 0 },
        subjectId: 12,
        synthesis: "",
        title: "Alcohol Fuelled Cars – The Oxidation of Alcohols",
        topic: "",
        updated: "2020-07-20T12:33:44.000Z",
      },
    ]

    const { container } = render(
      <Router history={history}>
        <Provider store={store}>
          <BackToWorkPage isMocked={true} bricks={bricks} />
        </Provider>
      </Router>
    );

    let brickContainers = container.getElementsByClassName("brick-container");
    expect(brickContainers).toHaveLength(2);

    let index = 0;
    let title = brickContainers[index].getElementsByClassName("link-description")[0];
    expect(title.textContent).toBe(bricks[index].title);
    let subtitles = brickContainers[index].getElementsByClassName("link-info")[0];
    let authorRow = brickContainers[index].getElementsByClassName("link-info")[1];
    expect(authorRow.textContent).toBe(bricks[index].author.firstName + ' ' + bricks[index].author.lastName + ' | 17.03.20 | 60 mins');
  });
})
*/