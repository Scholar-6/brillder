import React, { useEffect } from 'react';
import * as Y from "yjs";
import _ from "lodash";

import DifficultySelect from "../proposal/questionnaire/brickTitle/DifficultySelect";
import { useObserver } from '../baseComponents/hooks/useObserver';

interface Props {
  disabled: boolean;
  ybrick: Y.Map<any>;
}

const DifficultySelectObservable: React.FC<Props> = (props) => {
  const {ybrick} = props;
  const level = useObserver(ybrick, "academicLevel");

  return <DifficultySelect
    disabled={props.disabled}
    level={level}
    onChange={(academicLevel) =>
      ybrick.set("academicLevel", academicLevel)
    }
  />
}

export default DifficultySelectObservable;
