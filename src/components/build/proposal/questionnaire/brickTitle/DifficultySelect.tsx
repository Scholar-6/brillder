import React from "react";
import { Select, MenuItem } from "@material-ui/core";

import './DifficultySelect.scss';
import { AcademicLevel } from "model/brick";

interface DifficultySelectProps {
  disabled: boolean;
  level: AcademicLevel;
  onChange(keyWords: AcademicLevel): void;
}

const KeyWordsComponent: React.FC<DifficultySelectProps> = (props) => {
  let {level} = props;
  if (!level) {
    level = 0;
  }

  let className = 'difficulty-select';
  if (level === 0) {
    className += ' current-placeholder';
  }

  return (
    <div className={className}>
      <Select value={level} disabled={props.disabled} onChange={e => props.onChange(e.target.value as AcademicLevel)}>
        <MenuItem disabled style={{display: 'none'}} value={AcademicLevel.Default}>Select level</MenuItem>
        <MenuItem value={AcademicLevel.Fisrt}>I - level</MenuItem>
        <MenuItem value={AcademicLevel.Second}>II - level</MenuItem>
        <MenuItem value={AcademicLevel.Third}>III - level</MenuItem>
        <MenuItem value={AcademicLevel.Fourth}>IV - level</MenuItem>
      </Select>
    </div>
  );
}

export default KeyWordsComponent;
