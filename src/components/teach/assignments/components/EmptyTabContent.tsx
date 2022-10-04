import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { TeachClassroom } from 'model/classroom';
import React from 'react';

interface Props {
  classrooms: TeachClassroom[];
  activeClassroom: TeachClassroom | null;
  history: any;

  openClass(): void;
}

const EmptyTabContent: React.FC<Props> = (props) => {
  const { activeClassroom } = props;
  return (
    <div className="tab-content empty-tab">
      <div className={"tab-content-centered " + (activeClassroom ? 'empty-tab-content' : '')}>
        <div className="new-class-container" onClick={props.openClass}>
          <div className="icon-container">
            <SpriteIcon name="create-class-icon" className="stroke-1" />
          </div>
          <div className="bold-hover"><SpriteIcon name="plus-circle" /> Create Class</div>
          <div className="text-center f-s-2 m-t-2vh">Create a class to set assignments and track your students' progress</div>
        </div>
      </div>
    </div>
  );
}

export default EmptyTabContent;