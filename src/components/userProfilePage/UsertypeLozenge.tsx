import { RolePreference, UserRole, UserType } from 'model/user';
import React from 'react';

interface Props {
  roles: any[];
  rolePreference?: UserRole;
}

const UserTypeLozenge: React.FC<any> = (props) => {
  let bestType = props.rolePreference.roleId;
  let bestRole = null;

  if (props.roles) {
    const isAdmin = props.roles.find((roleId:number) => roleId === UserType.Admin);
    if (isAdmin) {
      bestRole = UserType.Admin;
    } else {
      const isPublisher = props.roles.find((roleId:number) => roleId === UserType.Publisher);
      if (isPublisher) {
        bestRole = UserType.Publisher;
      }
    }
  }

  let name = '';
  if (bestRole === UserType.Admin) {
    name = "Admin";
  } else if (bestRole === UserType.Publisher) {
    name = "Publisher";
  } else if (bestType === RolePreference.Student) {
    name = 'Student'
  } else if (bestType === RolePreference.Builder) {
    name = 'Builder';
  } else if (bestType === RolePreference.Teacher) {
    name = "Teacher";
  } else if (bestType === RolePreference.Institution) {
    name = "Institution";
  }

  return <span className="user-type-lozenge">
    {name}
  </span>;
}

export default UserTypeLozenge;
