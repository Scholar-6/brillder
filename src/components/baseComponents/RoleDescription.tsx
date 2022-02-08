import React from "react";

const RoleDescription: React.FC<any> = () => {
  return (
    <div className="role-description">
      <div>
        <span className="bold">L</span>: Learner
        <span className="bold m-2">E</span>: Educator
        <span className="bold m-1">B</span>: Builder
      </div>
      <div>
      <span className="bold">P</span>: Publisher
      <span className="bold m-1">A</span>: Admin
      </div>
    </div>
  );
}

export default RoleDescription;
