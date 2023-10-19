import React from "react";

import map from "components/map";

interface Props {
  assignClass: any;
  onlyAssignBricks?: boolean;
  history: any;
  click(): void;
}

const BottomAssignmentPopup: React.FC<any> = (props: Props) => {
  const renderCount = () => {
    let assignmentsCount = props.assignClass?.assignments?.length;
    if (assignmentsCount == 1) {
      return (
        <div>
          <div className="class-name font-16"><span className="bold">{props.assignClass?.name}</span></div>
          <div className="font-11">{assignmentsCount} Brick Assigned</div>
        </div>
      );
    }
    return (
      <div>
        <div className="class-name font-16"><span className="bold">{props.assignClass?.name}</span></div>
        <div className="font-11">{assignmentsCount} Bricks Assigned</div>
      </div>
    );
  }

  return (
    <div className="bottom-bricks-popup-f53">
      {renderCount()}
      <div className="btn" onClick={props.click}>Quit</div>
      <div className="btn btn-green" onClick={() => {
        props.history.push(map.TeachAssignedTab + '?classroomId=' + props.assignClass.id + '&onlyAssignBricks=true');
      }}>
        Back to Class
      </div>
    </div>
  );
}

export default BottomAssignmentPopup;
