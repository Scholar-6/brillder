import React, { useEffect } from 'react';
import * as Y from "yjs";
import _ from "lodash";
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SvgIcon,
} from "@material-ui/core";
import { Subject } from 'model/brick';

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { useObserver } from '../baseComponents/hooks/useObserver';

interface Props {
  disabled: boolean;
  ybrick: Y.Map<any>;
  subjects: Subject[];
}

const SubjectsObservable: React.FC<Props> = (props) => {
  const { ybrick, subjects } = props;

  const subjectId = useObserver(ybrick, "subjectId");
  const subjectIndex = React.useMemo(() => subjects.findIndex(s => s.id === subjectId), [subjects, subjectId]);

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
