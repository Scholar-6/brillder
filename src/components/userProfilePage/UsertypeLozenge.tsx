import { RolePreference, UserRole, UserType } from 'model/user';
import React from 'react';

interface Props {
  roles: any[];
  rolePreference?: UserRole;
}

const UserTypeLozenge: React.FC<any> = (props) => {
  let bestType = props.rolePreference.roleId;

  if (props.roles) {
    bestType = props.roles[0].roleId;
  }

  let name = '';
  if (bestType === RolePreference.Student) {
    name = 'Student'
  } else if (bestType === RolePreference.Builder) {
    name = 'Builder';
  } else if (bestType === RolePreference.Teacher) {
    name = "Teacher";
  } else if (bestType === RolePreference.Institution) {
    name = "Institution";
  } else if (bestType = UserType.Admin) {
    name = "Admim";
  } else if (bestType = UserType.Publisher) {
    name = "Publisher";
  }

  return <div className="user-type-lozenge">
   {name}
  </div>;
}

export default UserTypeLozenge;
