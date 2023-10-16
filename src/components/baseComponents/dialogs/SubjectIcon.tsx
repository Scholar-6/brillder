import React from 'react';
import { ListItemIcon, SvgIcon } from '@material-ui/core';
import { Subject } from 'model/brick';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface AssignClassProps {
  subject?: Subject | null;
}

const SubjectIcon: React.FC<AssignClassProps> = (props) => {
  return (
    <ListItemIcon>
      <SvgIcon>
        <SpriteIcon
          name="circle-filled"
          className="w100 h100 active"
          style={{ color: props.subject?.color || '' }}
        />
      </SvgIcon>
    </ListItemIcon>
  );
}

export default SubjectIcon;
