import React from 'react';
import { FormControlLabel } from "@material-ui/core";

import './ClassroomFilterItem.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import RadioButton from "components/baseComponents/buttons/RadioButton";

interface FilterItemProps {
  index: number;
  classroom: any;
  activeClassroom: any;
  setActiveClassroom(classroom: any): void;
  onDeleteClass(classroom: any): void;
  onDrop(e: React.DragEvent<HTMLDivElement>, classroomId: number): void;
}

const ClassroomFilterItem: React.FC<FilterItemProps> = props => {
  const { classroom, activeClassroom } = props;

  const [dropHover, setDropHover] = React.useState(false);

  let className = "index-box hover-light item-box2 student-drop-item";
  if (classroom.isActive) {
    className += " active";
  }

  if (dropHover) {
    className += ' drop-hover';
  }

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setDropHover(true);
    e.preventDefault();
  }

  return (
    <div
      key={props.index}
      className={className}
      onDrop={e => props.onDrop(e, classroom.id)}
      onDragOver={allowDrop} onDragLeave={() => setDropHover(false)}
      onClick={() => props.setActiveClassroom(classroom)}
    >
      <FormControlLabel
        checked={(activeClassroom && activeClassroom.id === classroom.id) ?? false}
        style={{ color: classroom.subject?.color ?? "#FFFFFF" }}
        control={
          <RadioButton
            checked={(activeClassroom && activeClassroom.id === classroom.id) ?? false}
            name={classroom.name} color={classroom.subject?.color ?? "#FFFFFF"}
          />
        }
        label={classroom.name}
      />
      <div className="right-index right-index2">
        {classroom.students.length}
        <SpriteIcon name="users" className="active" />
        <SpriteIcon
          name="trash-outline"
          className="active text-white remove-class"
          onClick={() => props.onDeleteClass(classroom)}
        />
      </div>
    </div>
  );
}

export default ClassroomFilterItem;