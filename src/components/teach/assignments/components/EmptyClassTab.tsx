import React from 'react';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import map from 'components/map';

interface Props {
  history: any;
}

const EmptyClassTab: React.FC<Props> = (props) => {
  return (
    <div className="assignments-column flex-center">
      <div className="empty-classroom-tab">
        <div className="icon-container flex-center glasses-icon-container" onClick={() => props.history.push(map.ViewAllPageB + '&newTeacher=true')}>
          <SpriteIcon name="empty-class-icon" className="glasses-icon" />
        </div>
        <div className="bold font-20 text-center">You haven’t added any assignments to this class</div>
        <div className="font-18 text-center">Click below to assign a brick to your students</div>
        <div className="flex-center">
          <div className="btn btn-orange btn-v342 font-18" onClick={() => props.history.push(map.ViewAllPageB + '&newTeacher=true')}>
            <span>Add Brick</span>
            <SpriteIcon name="lucide_book-open-plus" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmptyClassTab;