import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import { MUser } from 'components/teach/model';

interface UnassignStudentProps {
  student: MUser | null;
  isOpen: boolean;
  submit(): void;
  close(): void;
}

const UnassignStudentDialog: React.FC<UnassignStudentProps> = props => {
  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box">
      <div className="dialog-header">
        <div>Remove {props.student?.firstName} {props.student?.lastName} from this class?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={props.submit}>
          <span>Yes, remove</span>
        </button>
        <button className="btn btn-md bg-gray no-button"
          onClick={props.close}>
          <span>No, keep</span>
        </button>
      </div>
    </Dialog>
  );
}

export default UnassignStudentDialog;
