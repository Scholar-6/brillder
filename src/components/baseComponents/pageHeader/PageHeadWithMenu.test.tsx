import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PageHead from './PageHeadWithMenu';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import { NotificationType } from 'model/notifications';
import { isAuthenticated } from 'model/brick';

const middlewares = [thunkMiddleware];
const mockStore = configureMockStore(middlewares);

const mockNotification = {
  id: 1,
  sender: {
    email: "admin@test.com",
    firstName: "Admin",
    lastName: "User"
  },
  title: "Notification Title",
  text: "Notification Text",
  type: NotificationType.Generic,
  read: false,
  timestamp: new Date(0)
};

describe("notification panel", () => {
  it("should create Header with Menu", () => {
    const store = mockStore({
      user: {
        user: {roles:[]}
      },
      notifications: {
        notifications: [mockNotification]
      },
      auth: {
        isAuthenticated: isAuthenticated.True
      }
    });

    render(
      <Provider store={store}>
        <PageHead history={null} user={{roles:[]} as any} search={()=>{}} page={1} searching={()=>{}} />
      </Provider>
    );
    
  });
})