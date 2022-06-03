import React from 'react';
import { render } from '@testing-library/react';
import PageHead from './PageHeader';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import { NotificationType } from 'model/notifications';
import { isAuthenticated } from 'model/assignment';

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
  it("should create Header", () => {
    const store = mockStore({
      notifications: {
        notifications: [mockNotification]
      },
      user: {
        user: {
          roles: []
        }
      },
      auth: {
        isAuthenticated: isAuthenticated.True
      },
      getNotifications: () => {}
    });

    render(
      <Provider store={store}>
        <PageHead
          history={null}
          search={() => { }}
          page={1}
          searching={() => { }}
          searchPlaceholder=""
          showDropdown={() => {}}
          showNotifications={() => {}}
        />
      </Provider>
    );
  });
})