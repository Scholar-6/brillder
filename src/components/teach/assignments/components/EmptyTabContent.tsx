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
            <SpriteIcon name="glasses-sprite" className="stroke-1" />
          </div>
          <div className="bold">You don’t have any classes</div>
          <div className="text-center f-s-2">Create a class to set assignments and track your students' progress</div>
          <div className="flex-center">
            <div className="btn btn-orange">Create Class</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmptyTabContent;