import React from "react";
import { Select, MenuItem } from "@material-ui/core";

import './CoreSelect.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface DifficultySelectProps {
  disabled: boolean;
  isCore?: boolean;
  onChange(isCore: boolean): void;
}

const DifficultySelect: React.FC<DifficultySelectProps> = ({isCore, ...props}) => {
  return (
    <div className="core-select">
      <div className="fixed-icon">
        {isCore === true ? <SpriteIcon name="globe" /> : isCore === false ? <SpriteIcon name="key" /> : <div />}
      </div>
      <Select value={isCore} disabled={props.disabled} onChange={e => props.onChange(e.target.value as string === 'true')}>
        <MenuItem value="true">Public</MenuItem>
        <MenuItem value="false">Private</MenuItem>
      </Select>
    </div>
  );
}

export default DifficultySelect;
