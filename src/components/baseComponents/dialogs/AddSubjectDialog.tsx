import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { connect } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { ListItemIcon, ListItemText, MenuItem, SvgIcon } from '@material-ui/core';

import './AssignBrickClass.scss';
import actions from 'redux/actions/requestFailed';
import SpriteIcon from '../SpriteIcon';
import { Subject } from 'model/brick';
import { ReduxCombinedState } from 'redux/reducers';
import subjectActions from "redux/actions/subject";

interface AddSubjectProps {
  isOpen: boolean;
  userSubjects: Subject[];
  success(subject: any): void;
  close(): void;
  requestFailed(e: string): void;

  subjects: Subject[];
  getSubjects(): Subject[] | null;
}

const AddSubjectDialog: React.FC<AddSubjectProps> = (props) => {
  const [subjects, setSubjects] = React.useState([] as any[]);
  const [subject, setSubject] = React.useState(null as any);

  const loadSubjects = async () => {
    let loadedSubjects = props.subjects;
    if (loadedSubjects.length === 0) {
      let subjects = await props.getSubjects();
      if (subjects) {
        loadedSubjects = subjects;
      }
    }
     
    if (loadedSubjects) {
      for (let s2 of props.userSubjects) {
        loadedSubjects = loadedSubjects.filter(s => s2.id !== s.id);
      }
      setSubjects(loadedSubjects);
    } else {
      props.requestFailed('Can`t load subjects');
    }
  }

  /*eslint-disable-next-line*/
  useEffect(() => { loadSubjects() }, []);

  const addSubject = async () => {
    if (subject) {
      props.success(subject);
    }
  }

  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue assign-dialog assign-dialog-new add-subject-dialog">
      <div className="dialog-header">
        <div className="r-popup-title bold">Select a subject to add</div>
        <Autocomplete
          value={subject}
          options={subjects}
          onChange={(e: any, v: any) => setSubject(v)}
          noOptionsText="Sorry, try typing something else"
          className="subject-autocomplete"
          getOptionLabel={(option: any) => option.name}
          renderOption={(loopSubject: any) => (
            <React.Fragment>
              <MenuItem >
                <ListItemIcon>
                  <SvgIcon>
                    <SpriteIcon
                      name="circle-filled"
                      className="w100 h100 active"
                      style={{ color: loopSubject?.color || '' }}
                    />
                  </SvgIcon>
                </ListItemIcon>
                <ListItemText>
                  {loopSubject.name}
                </ListItemText>
              </MenuItem>
            </React.Fragment>
          )}
          renderInput={(params: any) => (
            <TextField
              {...params}
              variant="standard"
              label=""
              placeholder="Click to select a subject"
            />
          )}
        />
        <div className="dialog-footer centered-important" style={{ justifyContent: 'center' }}>
          <button
            className={subject
              ? "btn btn-md bg-theme-orange yes-button icon-button"
              : "btn btn-md b-dark-blue text-theme-light-blue yes-button icon-button"
            }
            onClick={addSubject} style={{ width: 'auto' }}
          >
            <div className="centered">
              <span className="label">Add Subject</span>
              <SpriteIcon name="file-plus" />
            </div>
          </button>
        </div>
      </div>
    </Dialog>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  subjects: state.subjects.subjects,
});

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
  getSubjects: () => dispatch(subjectActions.fetchSubjects()),
});

export default connect(mapState, mapDispatch)(AddSubjectDialog);
