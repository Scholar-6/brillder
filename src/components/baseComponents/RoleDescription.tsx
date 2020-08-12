import React from "react";

const RoleDescription: React.FC<any> = () => {
  return (
    <div className="role-description">
      <span className="bold">S</span>: Student,&nbsp;
      <span className="bold">T</span>: Teacher,&nbsp;
      <span className="bold">B</span>: Builder,&nbsp;
      <span className="bold">E</span>: Editor,&nbsp;
      <span className="bold">A</span>: Admin
    </div>
  );
}

export default RoleDescription;
