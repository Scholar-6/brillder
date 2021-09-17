import React from "react";
import { shallow } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import RolesBox from "./RolesBox";
import { RolePreference, UserType } from "model/user";

Enzyme.configure({ adapter: new Adapter() });

const roles = [
  { roleId: UserType.Publisher, name: "Publisher", disabled: false },
  { roleId: UserType.Admin, name: "Admin", disabled: false },
];

describe("Roles Box", () => {
  it("check student preference", () => {
    const component = shallow(
      <RolesBox
        roles={roles}
        userRoles={[]}
        rolePreference={RolePreference.Student}
        toggleRole={() => {}}
      />
    );
    expect(component).toHaveLength(1);
    expect(component.props().children).toHaveLength(6);
    expect(component.props().children[0].props.children.props.checked).toBe(true);
    expect(component.props().children[1].props.children.props.checked).toBe(false);
    expect(component.props().children[2].props.children.props.checked).toBe(false);
    expect(component.props().children[3].props.children.props.checked).toBe(false);
    expect(component.props().children[4].props.children.props.checked).toBe(false);
    expect(component.props().children[5].props.children.props.checked).toBe(false);
  });

  it("check teacher preference", () => {
    const component = shallow(
      <RolesBox
        roles={roles}
        userRoles={[]}
        rolePreference={RolePreference.Teacher}
        toggleRole={() => {}}
      />
    );
    expect(component).toHaveLength(1);
    expect(component.props().children).toHaveLength(6);
    expect(component.props().children[0].props.children.props.checked).toBe(false);
    expect(component.props().children[1].props.children.props.checked).toBe(true);
    expect(component.props().children[2].props.children.props.checked).toBe(false);
    expect(component.props().children[3].props.children.props.checked).toBe(false);
    expect(component.props().children[4].props.children.props.checked).toBe(false);
    expect(component.props().children[5].props.children.props.checked).toBe(false);
  });

  it("check builder preference", () => {
    const component = shallow(
      <RolesBox
        roles={roles}
        userRoles={[]}
        rolePreference={RolePreference.Builder}
        toggleRole={() => {}}
      />
    );
    expect(component).toHaveLength(1);
    expect(component.props().children).toHaveLength(6);
    expect(component.props().children[0].props.children.props.checked).toBe(false);
    expect(component.props().children[1].props.children.props.checked).toBe(false);
    expect(component.props().children[2].props.children.props.checked).toBe(true);
    expect(component.props().children[3].props.children.props.checked).toBe(false);
    expect(component.props().children[4].props.children.props.checked).toBe(false);
    expect(component.props().children[5].props.children.props.checked).toBe(false);
  });

  it("check admin role", () => {
    const component = shallow(
      <RolesBox
        roles={roles}
        userRoles={[UserType.Admin]}
        rolePreference={RolePreference.Builder}
        toggleRole={() => {}}
      />
    );
    expect(component).toHaveLength(1);
    expect(component.props().children).toHaveLength(6);
    expect(component.props().children[0].props.children.props.checked).toBe(false);
    expect(component.props().children[1].props.children.props.checked).toBe(false);
    expect(component.props().children[2].props.children.props.checked).toBe(true);
    expect(component.props().children[3].props.children.props.checked).toBe(false);
    expect(component.props().children[4].props.children.props.checked).toBe(false);
    expect(component.props().children[5].props.children.props.checked).toBe(true);
  });
  it("check all roles", () => {
    const component = shallow(
      <RolesBox
        roles={roles}
        userRoles={[UserType.Admin, UserType.Publisher]}
        rolePreference={RolePreference.Builder}
        toggleRole={() => {}}
      />
    );
    expect(component).toHaveLength(1);
    expect(component.props().children).toHaveLength(6);
    expect(component.props().children[0].props.children.props.checked).toBe(false);
    expect(component.props().children[1].props.children.props.checked).toBe(false);
    expect(component.props().children[2].props.children.props.checked).toBe(true);
    expect(component.props().children[3].props.children.props.checked).toBe(true);
    expect(component.props().children[4].props.children.props.checked).toBe(true);
    expect(component.props().children[5].props.children.props.checked).toBe(true);
  });

});
