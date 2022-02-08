import React from "react";
import { Select, MenuItem } from "@material-ui/core";

import './DifficultySelect.scss';
import { AcademicLevel } from "model/brick";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface DifficultySelectProps {
  disabled: boolean;
  level: AcademicLevel;
  onChange(keyWords: AcademicLevel): void;
}

const DifficultySelect: React.FC<DifficultySelectProps> = (props) => {
  let {level} = props;
  if (!level) {
    level = 0;
  }

  let className = 'difficulty-select custom-arrow';
  if (level === 0) {
    className += ' current-placeholder';
  }

  return (
    <div className={className}>
      <SpriteIcon name="arrow-down" className="arrow" />
      <Select value={level} disabled={props.disabled} onChange={e => props.onChange(e.target.value as AcademicLevel)} IconComponent={() => <SpriteIcon name="arrow-down" />}
        MenuProps={{className: 'difficult-popper'}}
      >
        <MenuItem disabled style={{display: 'none'}} value={AcademicLevel.Default}>Select level</MenuItem>
        <MenuItem value={AcademicLevel.First}>I: Foundation (GCSE equiv.)</MenuItem>
        <MenuItem value={AcademicLevel.Second}>II: Core (A Level / IB equiv.)</MenuItem>
        <MenuItem value={AcademicLevel.Third}>III: Extension (Oxbridge equiv.)</MenuItem>
      </Select>
    </div>
  );
}

export default DifficultySelect;
