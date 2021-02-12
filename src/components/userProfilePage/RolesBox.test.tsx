import React from "react";
import { shallow } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import RolesBox from "./RolesBox";
import { UserPreferenceEnum, UserType } from "model/user";

Enzyme.configure({ adapter: new Adapter() });

const roles = [
  { roleId: UserType.Publisher, name: "Publisher", disabled: false },
  { roleId: UserType.Institution, name: "Institution", disabled: false },
  { roleId: UserType.Admin, name: "Admin", disabled: false },
];

describe("Roles Box", () => {
  it("check student preference", () => {
    const component = shallow(
      <RolesBox
        roles={roles}
        userRoles={[]}
        preferenceId={UserPreferenceEnum.Student}
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
        preferenceId={UserPreferenceEnum.Teacher}
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
        preferenceId={UserPreferenceEnum.Builder}
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
        preferenceId={UserPreferenceEnum.Builder}
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
        userRoles={[UserType.Admin, UserType.Publisher, UserType.Institution]}
        preferenceId={UserPreferenceEnum.Builder}
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
