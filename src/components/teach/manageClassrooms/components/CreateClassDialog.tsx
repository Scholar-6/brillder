import React from 'react';
import Dialog from '@material-ui/core/Dialog';

interface AssignClassProps {
  isOpen: boolean;
  submit(value: string): void;
  close(): void;
}

const CreateClassDialog: React.FC<AssignClassProps> = (props) => {
  const [value, setValue] = React.useState("");

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box light-blue assign-class-dialog"
    >
      <div className="dialog-header" style={{marginBottom: '2vh'}}>
        <div className="title">What is the name of class?</div>
        <input value={value} onChange={e => setValue(e.target.value)} />
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={() => props.submit(value)}>
          <span>Create</span>
        </button>
        <button className="btn btn-md bg-gray no-button"
          onClick={props.close}>
          <span>Cancel</span>
        </button>
      </div>
    </Dialog>
  );
}

export default CreateClassDialog;
