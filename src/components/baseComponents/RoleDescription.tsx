import React from "react";

const RoleDescription: React.FC<any> = () => {
  return (
    <div className="role-description">
      <span className="bold">L</span>: Learner,&nbsp;
      <span className="bold">E</span>: Educator,&nbsp;
      <span className="bold">B</span>: Builder,&nbsp;
      <span className="bold">P</span>: Publisher,&nbsp;
      <span className="bold">A</span>: Admin
    </div>
  );
}

export default RoleDescription;
