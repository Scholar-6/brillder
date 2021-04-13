import React from "react";
import AnimateHeight from "react-animate-height";

import { TeachClassroom } from "model/classroom";

interface Props {
  filterHeight: string;
  classrooms: TeachClassroom[];
  activeId: number;
  filterByClassroom(c: number): void;
}

const ClassroomList:React.FC<Props> = props => {
  return (
    <AnimateHeight
      duration={500}
      className="indexes-box"
      height={props.filterHeight}
      style={{ width: "100%" }}
    >
      <div className="classroom-filter-custom">
        {props.classrooms.map((c, i) => 
          <div className={`index-box hover-light ${c.id === props.activeId ? 'active' : ''}`} key={i} onClick={() => props.filterByClassroom(c.id)}>
            {c.name}
          </div>
        )}
      </div>
    </AnimateHeight>
  );
}

export default ClassroomList;
