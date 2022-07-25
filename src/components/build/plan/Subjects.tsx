import React from 'react';
import {
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
  subjects: Subject[];
  subjectId: number | null;
  onChange(subjectId: number): void;
}

const Subjects: React.FC<Props> = (props) => {
  const { subjects, subjectId, onChange } = props;

  const subjectIndex = React.useMemo(() => {
    if (subjectId) {
      return subjects.findIndex(s => s.id === subjectId)
    } else {
      return 0;
    }
  }, [subjects, subjectId]);

  return (
    <Select
      value={subjectIndex}
      disabled={props.disabled}
      onChange={(evt) => onChange(subjects[evt.target.value as number].id as number)}
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

export default Subjects;
