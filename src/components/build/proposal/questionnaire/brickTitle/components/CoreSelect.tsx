import React from "react";
import { Select, MenuItem } from "@material-ui/core";

import './CoreSelect.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { BrickStatus } from "model/brick";

interface DifficultySelectProps {
  disabled: boolean;
  brickStatus: BrickStatus;
  isCore?: boolean;
  onChange(isCore: boolean): void;
}

const DifficultySelect: React.FC<DifficultySelectProps> = ({isCore, ...props}) => {
  let coreSelectLocked = props.disabled;
  
  // lock if self published
  if (isCore === false && props.brickStatus === BrickStatus.Publish) {
    //coreSelectLocked = true;
  }
  
  return (
    <div className="core-select">
      <div className="fixed-icon">
        {isCore === true ? <SpriteIcon name="globe" /> : isCore === false ? <SpriteIcon name="key" /> : <div />}
      </div>
      <Select value={isCore} disabled={coreSelectLocked} onChange={e => props.onChange(e.target.value as string === 'true')}>
        <MenuItem value="true">Public</MenuItem>
        <MenuItem value="false">Personal</MenuItem>
      </Select>
    </div>
  );
}

export default DifficultySelect;
