import React, { useEffect } from 'react';
import * as Y from "yjs";
import _ from "lodash";

import DifficultySelect from "../proposal/questionnaire/brickTitle/DifficultySelect";

interface Props {
  disabled: boolean;
  ybrick: Y.Map<any>;
}

const DifficultySelectObservable: React.FC<Props> = (props) => {
  const {ybrick} = props;

  const [level, setLevel] = React.useState(ybrick.get("academicLevel"));

  // when mounted observe if level changed and set new text
  useEffect(() => {
    const observer = _.throttle((evt: any) => {
      const newLevel = ybrick.get("academicLevel");
      setLevel(newLevel);
    }, 200);

    ybrick.observe(observer);
    return () => { ybrick.unobserve(observer) }
  // eslint-disable-next-line
  }, []);

  return <DifficultySelect
    disabled={props.disabled}
    level={level}
    onChange={(academicLevel) =>
      ybrick.set("academicLevel", academicLevel)
    }
  />
}

export default DifficultySelectObservable;
