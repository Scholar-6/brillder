import SpriteIcon from 'components/baseComponents/SpriteIcon';
import map from 'components/map';
import { TeachClassroom } from 'model/classroom';
import React from 'react';

interface Props {
  activeClassroom: TeachClassroom | null;
  history: any;
}

const EmptyClassTab: React.FC<Props> = (props) => {
  const { activeClassroom } = props;
  return (
    <div className="tab-content">
      <div className={"tab-content-centered " + (activeClassroom ? 'empty-tab-content' : '')}>
        <div>
          <div className="icon-container glasses-icon-container" onClick={() => props.history.push(map.ViewAllPageB + '&newTeacher=true')}>
            <SpriteIcon name="glasses-home-blue" className="glasses-icon" />
            <div className="glass-eyes-inside">
              <div className="glass-eyes-left svgOnHover">
                <svg className="svg active eyeball" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path fill="#F5F6F7" className="eyeball" d="M2,12c0,0,3.6-7.3,10-7.3S22,12,22,12s-3.6,7.3-10,7.3S2,12,2,12z" />
                </svg>
                <div className="glass-left-inside svgOnHover">
                  {/* <SpriteIcon name="aperture" className="aperture" /> */}
                  <SpriteIcon name="eye-pupil" className="eye-pupil" />
                </div>
              </div>
              <div className="glass-eyes-right svgOnHover">
                <svg className="svg active eyeball" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path fill="#F5F6F7" className="eyeball" d="M2,12c0,0,3.6-7.3,10-7.3S22,12,22,12s-3.6,7.3-10,7.3S2,12,2,12z" />
                </svg>
                <div className="glass-right-inside svgOnHover">
                  {/* <SpriteIcon name="aperture" className="aperture" /> */}
                  <SpriteIcon name="eye-pupil" className="eye-pupil" />
                </div>
              </div>
            </div>
          </div>
          {activeClassroom && <div className="bold">{activeClassroom.name} has no assignments for the moment</div>}
        </div>
      </div>
    </div>
  );
}

export default EmptyClassTab;