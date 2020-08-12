import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import sprite from 'assets/img/icons-sprite.svg';

interface AssignPersonOrClassProps {
  isOpen: boolean;
  close(): void;
}

const AssignPersonOrClassDialog: React.FC<AssignPersonOrClassProps> = (props) => {
  const [value, setValue] = React.useState("");
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box light-blue"
    >
      <div className="dialog-header">
        <div>Which class would you like to add these students to?</div>
        <div>
          <svg className="svg active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#users"} />
          </svg>
          Selected:
        </div>
        <input value={value} onChange={e => setValue(e.target.value)} />
        <div className="records-box">
        </div>
      </div>
    </Dialog>
  );
}

export default AssignPersonOrClassDialog;
