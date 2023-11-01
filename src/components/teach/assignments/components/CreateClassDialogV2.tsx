import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';

import './CreateClassDialog.scss';
import { createClass } from 'components/teach/service';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import map from 'components/map';
import { assignClasses } from 'services/axios/assignBrick';

interface AssignClassProps {
  isOpen: boolean;
  brickId: number;
  close(double?: boolean): void;
  history?: any;
}

const CreateClassDialogV2: React.FC<AssignClassProps> = (props) => {
  const [value, setValue] = useState("");
  const [canSubmit, setSubmit] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const createV2 = async (value: string) => {
    if (isSaving) { return; }
    setSaving(true);

    if (canSubmit === false || value === '') {
      return;
    }

    if (value) {
      const newClassroom = await createClass(value);
      if (newClassroom) {
        const res = await assignClasses(props.brickId, { classesIds: [newClassroom.id] });
        if (res.success) {
          props.history.push(map.TeachAssignedTab + '?classroomId=' + newClassroom.id + '&shareOpen=true');
        }
      }
    }
    setSaving(false);
  }


  return (<div>
    <Dialog
      open={props.isOpen}
      onClose={() => props.close(true)}
      className="dialog-box light-blue assign-class-dialog create-classroom-dialog new-class-r5"
    >
      <div className="dialog-header">
        <div className="title-box">
          <div className="title font-18">New Class</div>
          <SpriteIcon name="cancel-custom" onClick={() => props.close(true)} />
        </div>
        <div className="text-block">
          <div className="text-r324 font-14">Enter the name of your class</div>
          <div className="r-class-inputs">
            <input placeholder="Class name" value={value} className="font-14" onChange={e => {
              if (canSubmit === false && value.length > 0) {
                setSubmit(true);
              } else if (canSubmit === true && value.length === 0) {
                setSubmit(false);
              }
              setValue(e.target.value);
            }} />
          </div>
        </div>
      </div>
      <div className="dialog-footer">
        <div className="info-box">
          <SpriteIcon name="info-icon" />
        </div>
        <div className="message-box-r5 font-11">
          Choose a name that will be recognisable later to you and to your students, for example: <span className="italic">Year 11 French 2023.</span>
        </div>
        <button
          className="btn btn-md font-16 cancel-button"
          onClick={() => props.close(false)}
        >
          <span className="bold">Back</span>
        </button>
        <button
          className={`btn btn-md bg-theme-green font-16 yes-button ${!canSubmit ? 'invalid' : ''}`}
          onClick={() => createV2(value)}
        >
          <span className="bold">Next</span>
        </button>
      </div>
    </Dialog>
  </div>
  );
}

export default CreateClassDialogV2;
