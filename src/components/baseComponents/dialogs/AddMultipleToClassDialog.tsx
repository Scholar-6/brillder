import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { ListItemText, MenuItem, Popper } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import { stripHtml } from 'components/build/questionService/ConvertService';
import { Brick, Subject } from 'model/brick';
import { assignClasses } from 'services/axios/assignBrick';
import { searchClassroomsByName } from 'services/axios/classroom';

import BrickTitle from 'components/baseComponents/BrickTitle';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { Classroom } from 'model/classroom';
import SubjectIcon from './SubjectIcon';

import './AddMultipleToClassDialog.scss';

interface AssignClassProps {
  brick: Brick;
  subjects: Subject[];

  submit(): void;
  close(): void;
}

const PopperCustom = function (props: any) {
  return (<Popper {...props} className="assign-brick-class-poopper" />)
}

const AddMultipleToClassDialog: React.FC<AssignClassProps> = (props) => {
  const [canSubmit, setSubmit] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const [classrooms, setClassrooms] = useState([] as any[]);
  const [selectedClassrooms, setSelectedClasses] = useState([] as Classroom[]);

  const [searchText, setSearchText] = useState('');

  const addToClasses = async () => {
    if (isSaving) { return; }
    setSaving(true);

    if (selectedClassrooms.length === 0) {
      setSaving(false);
      return;
    }

    const res = await assignClasses(props.brick.id, { classesIds: selectedClassrooms.map(s => s.id) });

    if (res && res.success) {
      props.submit();
    }

    setSaving(false);
  }

  return (
    <Dialog
      open={true}
      onClose={props.close}
      className="dialog-box light-blue assign-class-dialog create-classroom-dialog new-class-r5 assign-multiple-class"
    >
      <div className="dialog-header">
        <div className="title-box">
          <div className="title font-18">Add to multiple classes</div>
          <SpriteIcon name="cancel-custom" onClick={props.close} />
        </div>
        <div className="text-block">
          <div className="r-class-inputs search-class-box">
            <Autocomplete
              multiple
              value={selectedClassrooms}
              options={classrooms}
              onChange={async (e: any, updatedClasses: any) => {
                if (updatedClasses && updatedClasses.length > 0) {
                  setSelectedClasses(updatedClasses);
                  setSubmit(true);
                }
              }}
              noOptionsText="Sorry, try typing something else"
              className="subject-autocomplete"
              PopperComponent={PopperCustom}
              getOptionLabel={(option: any) => stripHtml(option.name)}
              renderOption={(classroom: Classroom) => {
                const subject = props.subjects.find(s => s.id === classroom.subjectId);
                return (
                  <React.Fragment>
                    <MenuItem>
                      <SubjectIcon subject={subject} />
                      <ListItemText>
                        <BrickTitle title={classroom.name} />
                      </ListItemText>
                    </MenuItem>
                  </React.Fragment>
                )
              }}
              renderInput={(params: any) => {
                params.inputProps.value = searchText;

                return (
                  <div>
                    <div className="search-container">
                      <SpriteIcon name="search-custom" />
                    </div>
                    <TextField
                      {...params}
                      variant="standard"
                      label=""
                      onChange={async (e) => {
                        setSearchText(e.target.value);
                        if (e.target.value.length >= 3) {
                          const classes = await searchClassroomsByName(e.target.value);
                          if (classes) {
                            setClassrooms(classes);
                          }
                        }
                      }}
                      placeholder="Search by class name"
                    />
                  </div>
                )
              }}
            />
          </div>
        </div>
      </div>
      <div className="dialog-footer">
        <div className="info-box">
        </div>
        <div className="message-box-r5 clickable-btn flex-y-center font-16 bold" />
        <button
          className="btn btn-md font-16 cancel-button"
          onClick={props.close}
        >
          <span className="bold">Cancel</span>
        </button>
        <button
          className={`btn btn-md bg-theme-green font-16 yes-button ${!canSubmit ? 'invalid' : ''}`}
          onClick={addToClasses}
        >
          <span className="bold">Assign</span>
        </button>
      </div>
    </Dialog>
  );
}

export default AddMultipleToClassDialog;
