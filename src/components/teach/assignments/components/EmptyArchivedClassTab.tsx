import React from 'react';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface Props {
  unarchive(): void;
}

const EmptyArchivedClassTab: React.FC<Props> = (props) => {
  return (
    <div className="tab-content">
      <div className={"tab-content-centered empty-tab-content unarchive-empty-tab"}>
        <div>
          <div className="icon-container glasses-icon-container" onClick={() => { }}>
            <SpriteIcon name="unarchive-icon" className="glasses-icon" />
          </div>
          <div className="bold">Class is Archived</div>
          <div className="text-center">
            <div>Unarchive class to assign bricks to</div>
            <div>your students</div>
          </div>
          <div className="flex-center">
            <div className="btn flex-center" onClick={props.unarchive}>
              <div>Restore Class</div>
              <SpriteIcon name="f-arrow-up-circle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmptyArchivedClassTab;