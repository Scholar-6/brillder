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
        <select
          value={value}
          className="select"
          onChange={(e) => setValue(e.target.value)}
        >
          <option value="" hidden disabled selected></option>
          {classes.map((c)=> <option value={c}>{c}</option>)}
        </select>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={props.close}>
          <span>Ok</span>
        </button>
      </div>
    </Dialog>
  );
}

export default AssignPersonOrClassDialog;
