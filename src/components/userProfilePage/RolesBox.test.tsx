import React from "react";
import { shallow } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import RolesBox from "./RolesBox";
import { UserPreferenceType, UserType } from "model/user";

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
        userId={1}
        isAdmin={false}
        togglePreference={() => {}}
        userPreference={UserPreferenceType.Student}
        toggleRole={() => {}}
      />
    );
    expect(component).toHaveLength(1);
    expect(component.props().children).toHaveLength(3);

    
    const firstChildren = component.props().children[1].props.children;
    console.log(firstChildren[0].props.children.props.checked)
    expect(firstChildren[0].props.children.props.checked).toBe(true);
    expect(firstChildren[1].props.children.props.checked).toBe(false);
    expect(firstChildren[2].props.children.props.checked).toBe(false);

    const secondChildren = component.props().children[2].props.children;
    expect(secondChildren[0].props.children.props.checked).toBe(false);
    expect(secondChildren[1].props.children.props.checked).toBe(false);
    expect(secondChildren[2].props.children.props.checked).toBe(false);
  });

  it("check teacher preference", () => {
    const component = shallow(
      <RolesBox
        roles={roles}
        userRoles={[]}
        userId={1}
        isAdmin={false}
        togglePreference={() => {}}
        userPreference={UserPreferenceType.Teacher}
        toggleRole={() => {}}
      />
    );
    expect(component).toHaveLength(1);
    expect(component.props().children).toHaveLength(3);

    const firstChildren = component.props().children[1].props.children;
    expect(firstChildren[0].props.children.props.checked).toBe(false);
    expect(firstChildren[1].props.children.props.checked).toBe(true);
    expect(firstChildren[2].props.children.props.checked).toBe(false);

    const secondChildren = component.props().children[2].props.children;
    expect(secondChildren[0].props.children.props.checked).toBe(false);
    expect(secondChildren[1].props.children.props.checked).toBe(false);
    expect(secondChildren[2].props.children.props.checked).toBe(false);
  });

  it("check builder preference", () => {
    const component = shallow(
      <RolesBox
        roles={roles}
        userId={1}
        isAdmin={false}
        togglePreference={() => {}}
        userRoles={[]}
        userPreference={UserPreferenceType.Builder}
        toggleRole={() => {}}
      />
    );
    expect(component).toHaveLength(1);
    expect(component.props().children).toHaveLength(3);
    const firstColumn = component.props().children[1].props;
    expect(firstColumn.children[0].props.children.props.checked).toBe(false);
    expect(firstColumn.children[1].props.children.props.checked).toBe(false);
    expect(firstColumn.children[2].props.children.props.checked).toBe(true);

    const secondColumn = component.props().children[2].props;
    expect(secondColumn.children[0].props.children.props.checked).toBe(false);
    expect(secondColumn.children[1].props.children.props.checked).toBe(false);
    expect(secondColumn.children[2].props.children.props.checked).toBe(false);
  });

  
  it("check institution preference", () => {
    const component = shallow(
      <RolesBox
        roles={roles}
        userId={1}
        isAdmin={false}
        togglePreference={() => {}}
        userRoles={[]}
        userPreference={UserPreferenceType.Institution}
        toggleRole={() => {}}
      />
    );
    expect(component).toHaveLength(1);
    expect(component.props().children).toHaveLength(3);
    
    const firstColumn = component.props().children[1].props;
    expect(firstColumn.children[0].props.children.props.checked).toBe(false);
    expect(firstColumn.children[1].props.children.props.checked).toBe(false);
    expect(firstColumn.children[2].props.children.props.checked).toBe(false);

    const secondColumn = component.props().children[2].props;
    expect(secondColumn.children[0].props.children.props.checked).toBe(true);
    expect(secondColumn.children[1].props.children.props.checked).toBe(false);
    expect(secondColumn.children[2].props.children.props.checked).toBe(false);
  });

  it("check admin role", () => {
    const component = shallow(
      <RolesBox
        roles={roles}
        userId={1}
        isAdmin={false}
        togglePreference={() => {}}
        userRoles={[UserType.Admin]}
        userPreference={UserPreferenceType.Builder}
        toggleRole={() => {}}
      />
    );
    expect(component).toHaveLength(1);
    expect(component.props().children).toHaveLength(3);

    const firstChildren = component.props().children[1].props.children;
    expect(firstChildren[0].props.children.props.checked).toBe(false);
    expect(firstChildren[1].props.children.props.checked).toBe(false);
    expect(firstChildren[2].props.children.props.checked).toBe(true);

    const secondChildren = component.props().children[2].props.children;
    expect(secondChildren[0].props.children.props.checked).toBe(false);
    expect(secondChildren[1].props.children.props.checked).toBe(false);
    expect(secondChildren[2].props.children.props.checked).toBe(true);
  });
  it("check all roles", () => {
    const component = shallow(
      <RolesBox
        roles={roles}
        userId={1}
        isAdmin={false}
        togglePreference={() => {}}
        userRoles={[UserType.Admin, UserType.Publisher]}
        userPreference={UserPreferenceType.Builder}
        toggleRole={() => {}}
      />
    );
    expect(component).toHaveLength(1);
    expect(component.props().children).toHaveLength(3);

    const firstChildren = component.props().children[1].props.children;
    expect(firstChildren[0].props.children.props.checked).toBe(false);
    expect(firstChildren[1].props.children.props.checked).toBe(false);
    expect(firstChildren[2].props.children.props.checked).toBe(true);

    const secondChildren = component.props().children[2].props.children;
    expect(secondChildren[0].props.children.props.checked).toBe(false);
    expect(secondChildren[1].props.children.props.checked).toBe(true);
    expect(secondChildren[2].props.children.props.checked).toBe(true);
  });
});
