import React from "react";
import { shallow } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import ManageClassrooms from "./ManageClassrooms";

const mockStore = configureMockStore([ thunk ]);

Enzyme.configure({ adapter: new Adapter() });

const mockUser = {
  bio: null,
  email: "ivanteach23@test.com",
  firstName: "Ivan",
  hasPlayedBrick: false,
  id: 313,
  lastName: "Teach",
  profileImage: null,
  rolePreference: {roleId: 2},
  roles: [{roleId: 1}, {roleId: 2}, {roleId: 3}],
  status: 1,
  subjects: [],
  tutorialPassed: false,
  username: "Ivan1813",
};

let store: any = {};
describe("Manage Classrooms", () => {
  beforeEach(() => {
    jest.mock('../service', () => {
      return {
        'default' : {
          getAllClassrooms: jest.fn(() => Promise.resolve([])),
        }
      }
    });
    store = mockStore({user: { user: mockUser}});
  });
  it("should render", () => {
    const component = shallow(
      <Provider store={store}>
        <ManageClassrooms  history={{}} />
      </Provider>
    );
    expect(component).toHaveLength(1);
  });
});
