import React from 'react';

import { Select, MenuItem } from "@material-ui/core";
import { BrickLengthEnum } from 'model/brick';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface Props {
  disabled: boolean;
  brickLength: BrickLengthEnum;
  onChange(brickLength: BrickLengthEnum): void;
}

const BrickLength: React.FC<Props> = (props) => {

  return (
    <div className="brick-length">
      <div className="fixed-select-clock"><SpriteIcon name="clock" /></div>
      <Select
        value={props.brickLength}
        disabled={props.disabled}
        className="select"
        onChange={(evt) => props.onChange(evt.target.value as BrickLengthEnum)}
      >
        <MenuItem value={BrickLengthEnum.S20min}>
          20 mins
      </MenuItem>
        <MenuItem value={BrickLengthEnum.S40min}>
          40 mins
      </MenuItem>
        <MenuItem value={BrickLengthEnum.S60min}>
          60 mins
      </MenuItem>
      </Select>
    </div>
  );
}

export default BrickLength;
