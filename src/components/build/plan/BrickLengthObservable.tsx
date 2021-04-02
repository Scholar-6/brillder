import React, { useEffect } from 'react';
import * as Y from "yjs";
import _ from "lodash";

import { Select, MenuItem } from "@material-ui/core";
import { BrickLengthEnum } from 'model/brick';

interface Props {
  disabled: boolean;
  ybrick: Y.Map<any>;
}

const BrickLengthObservable: React.FC<Props> = (props) => {
  const { ybrick } = props;

  const [brickLength, setLength] = React.useState(ybrick.get("brickLength"));

  // when mounted observe if level changed and set new text
  useEffect(() => {
    const observer = _.throttle(() => {
      const newLength = ybrick.get("brickLength");
      setLength(newLength);
    }, 200);

    ybrick.observe(observer);
    return () => { ybrick.unobserve(observer) }
    // eslint-disable-next-line
  }, []);

  return (
    <Select
      className="brick-length"
      value={brickLength}
      onChange={(evt) => ybrick.set("brickLength", evt.target.value)}
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
  );
}

export default BrickLengthObservable;
