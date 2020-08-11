import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Select } from '@material-ui/core';
import MenuItem from "@material-ui/core/MenuItem";

interface AssignPersonOrClassProps {
  isOpen: boolean;
  close(): void;
}

const AssignPersonOrClassDialog: React.FC<AssignPersonOrClassProps> = (props) => {
  let classes:string[] = ["class1", "class2"];
  const [value, setValue] = React.useState("");
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box light-blue"
    >
      <div className="dialog-header">
        <div>Who would you like to assign this brick to?</div>
        <input value={value} onChange={e => setValue(e.target.value)} />
        <div className="records-box">
        </div>
      </div>
    </Dialog>
  );
}

export default AssignPersonOrClassDialog;
