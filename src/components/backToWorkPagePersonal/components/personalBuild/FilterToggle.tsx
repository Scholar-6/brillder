import React from "react";
import { FormControlLabel, Radio } from "@material-ui/core";

interface FilterToggleProps {
  checked: boolean;
  label: string;
  count: number;
  color: string;
  onClick(): void;
}

const FilterToggle:React.FC<FilterToggleProps> = (props) => {
  return (
    <div className={`index-box ${props.color}`}>
      <FormControlLabel
        checked={props.checked}
        control={<Radio onClick={props.onClick} className={"filter-radio custom-color"} />}
        label={props.label} />
      <div className="right-index">{props.count}</div>
    </div>
  );
}

export default FilterToggle;
