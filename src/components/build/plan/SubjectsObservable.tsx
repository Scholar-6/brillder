import React, { useEffect } from 'react';
import * as Y from "yjs";
import _ from "lodash";
import {
  InputBase,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SvgIcon,
} from "@material-ui/core";
import { Subject } from 'model/brick';

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface Props {
  disabled: boolean;
  ybrick: Y.Map<any>;
  subjects: Subject[];
}

const SubjectsObservable: React.FC<Props> = (props) => {
  const { ybrick, subjects } = props;
  const initSubjectId = ybrick.get("subjectId");
  const initSubjectIndex = subjects.findIndex((s) => s.id === initSubjectId);
  const [subjectIndex, setSubjectIndex] = React.useState<number>(initSubjectIndex);

  // when mounted observe if level changed and set new text
  useEffect(() => {
    const observer = _.throttle((evt: any) => {
      const newSubjectId = ybrick.get("subjectId");
      const newSubjectIndex = subjects.findIndex((s) => s.id === newSubjectId);
      setSubjectIndex(newSubjectIndex);
    }, 200);

    ybrick.observe(observer);
    return () => { ybrick.unobserve(observer) }
    // eslint-disable-next-line
  }, []);

  return (
    <Select
      value={subjectIndex}
      disabled={props.disabled}
      onChange={(evt) => ybrick.set("subjectId", subjects[evt.target.value as number].id as number)}
    >
      {subjects.map((s, i) => (
        <MenuItem value={i} key={i}>
          <ListItemIcon>
            <SvgIcon>
              <SpriteIcon
                name="circle-filled"
                className="w100 h100 active"
                style={{ color: s.color }}
              />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText>{s.name}</ListItemText>
        </MenuItem>
      ))}
    </Select>
  );
}

export default SubjectsObservable;
