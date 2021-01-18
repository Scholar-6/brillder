import React from "react";
import { render } from "@testing-library/react";

import RolesBox from "./RolesBox";
import { UserRole, UserType } from "model/user";


describe("Roles Box", () => {
  const roles: [
    { roleId: UserType.Publisher, name: "Publisher", disabled: !isEditor },
    { roleId: UserType.Institution, name: "Institution", disabled: !isInstitute },
    { roleId: UserType.Admin, name: "Admin", disabled: !isAdmin },
  ];

  it("should create Roles Box", () => {
    render(
      <RolesBox
        roles={roles}
        userRoles={[]}
        rolePreference={UserType.Student}
        toggleRole={() => {}}
      />
    );
  });
});
