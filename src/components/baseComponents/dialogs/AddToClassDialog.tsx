import React, { useState } from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import { ListItemText, MenuItem, Popper } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import { stripHtml } from 'components/build/questionService/ConvertService';
import { Brick, Subject } from 'model/brick';
import { getAllClassrooms } from 'components/teach/service';
import { assignClasses } from 'services/axios/assignBrick';
import { searchClassroomsByName } from 'services/axios/classroom';
import map from 'components/map';

import './AddToClassDialog.scss';
import BrickTitle from 'components/baseComponents/BrickTitle';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { Classroom } from 'model/classroom';
import AddMultipleToClassDialog from './AddMultipleToClassDialog';
import SubjectIcon from './SubjectIcon';

interface AssignClassProps {
  isOpen: boolean;
  subjects: Subject[];

  brick: Brick;

  submit(classroomId: number): void;
  close(): void;
  exit(): void;

  user: User;
  history?: any;
}

const PopperCustom = function (props: any) {
  return (<Popper {...props} className="assign-brick-class-poopper" />)
}

const AddToClassDialog: React.FC<AssignClassProps> = (props) => {
  const [multiple, setMultiple] = useState(false);

  const [canSubmit, setSubmit] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const [classroom, setClassroom] = useState(null as any);
  const [classrooms, setClassrooms] = useState([] as any[]);
  const [searchText, setSearchText] = useState('');

  const [standartClasses, setStandartClasses] = useState([] as any[]);
  
  const setClasses = async () => {
    var classesV2 = await getAllClassrooms();
    if (classesV2) {
      setStandartClasses(classesV2.slice(0, 5));
    }
  }

  React.useEffect(() => {setClasses()}, []);

  const addToClass = async () => {
    if (isSaving) { return; }
    setSaving(true);

    if (canSubmit === false || !classroom) {
      setSaving(false);
      return;
    }

    const res = await assignClasses(props.brick.id, { classesIds: [classroom.id] });
    if (res) {
      setSaving(false);

      props.history.push(map.TeachAssignedTab + '?classroomId=' + classroom.id);
    }
  }

  if (multiple) {
    return <AddMultipleToClassDialog brick={props.brick} subjects={props.subjects} submit={() => {
      setMultiple(false);
      props.history?.push(map.TeachAssignedTab);
      props.close();
    }} close={() => setMultiple(false)} />;
  }

  let result = classrooms;
  if (classrooms.length === 0 && searchText.length <= 2) {
    result = standartClasses;
  } else if (searchText.length <= 2) {
    result = standartClasses;
  }

  return (<div>
    <Dialog
      open={props.isOpen}
      onClose={props.exit}
      className="dialog-box light-blue assign-class-dialog create-classroom-dialog new-class-r5 add-to-class-r5"
    >
      <div className="dialog-header">
        <div className="title-box">
          <div className="title font-18">Add to Class</div>
          <SpriteIcon name="cancel-custom" onClick={props.exit} />
        </div>
        <div className="text-block">
          <div className="text-r324 font-14">Find your class</div>
          <div className="r-class-inputs search-class-box">
            <Autocomplete
              value={classroom}
              options={result}
              onChange={async (e: any, classV2: any) => {
                if (classV2) {
                  setClassroom(classV2);
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
                        } else {
                          setClassrooms([]);
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
        <div className="message-box-r5 clickable-btn flex-y-center font-16 bold" onClick={() => {
          setMultiple(true);
        }}>
          Add to multiple classes
        </div>
        <button
          className="btn btn-md font-16 cancel-button"
          onClick={props.close}
        >
          <span className="bold">Back</span>
        </button>
        <button
          className={`btn btn-md bg-theme-green font-16 yes-button ${!canSubmit ? 'invalid' : ''}`}
          onClick={addToClass}
        >
          <span className="bold">Next</span>
        </button>
      </div>
    </Dialog>
  </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

export default connect(mapState)(AddToClassDialog);
