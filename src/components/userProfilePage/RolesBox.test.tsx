import React from "react";
import { render } from "@testing-library/react";
import {shallow} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import RolesBox from "./RolesBox";
import { UserRole, UserType } from "model/user";

Enzyme.configure({ adapter: new Adapter() })

describe("Roles Box", () => {
  
  it("should create Roles Box", () => {
    const roles = [
      { roleId: UserType.Publisher, name: "Publisher", disabled: false },
      { roleId: UserType.Institution, name: "Institution", disabled: false },
      { roleId: UserType.Admin, name: "Admin", disabled: false },
    ];

    const component = shallow(
      <RolesBox
        roles={roles}
        userRoles={[]}
        rolePreference={UserType.Student}
        toggleRole={() => {}}
      />
    );
    console.log(component.props());
    expect(component).toHaveLength(1);
    expect(component.props().children).toHaveLength(6);
  });
});
