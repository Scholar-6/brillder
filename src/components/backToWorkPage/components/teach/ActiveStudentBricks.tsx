import React, { Component } from "react";

import { TeachClassroom, Assignment, StudentStatus, TeachStudent } from "model/classroom";


interface TeachListItem {
  classroom: TeachClassroom;
  assignment: Assignment | null;
}

interface ActiveStudentBricksProps {
  activeStudent: TeachStudent;
}

class ActiveStudentBricks extends Component<ActiveStudentBricksProps> {
  render() {
    return (
      <div className="classroom-list">
        student bricks are not implemented yet
      </div>
    );
  }
}

export default ActiveStudentBricks;
