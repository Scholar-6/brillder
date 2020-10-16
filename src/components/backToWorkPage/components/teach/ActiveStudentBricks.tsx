import React, { Component } from "react";

import { TeachStudent } from "model/classroom";


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
