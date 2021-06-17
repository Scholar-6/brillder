import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { connect } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { ListItemIcon, ListItemText, MenuItem, SvgIcon } from '@material-ui/core';


import './AssignBrickClass.scss';
import actions from 'redux/actions/requestFailed';
import SpriteIcon from '../SpriteIcon';
import { getSubjects } from 'services/axios/subject';

interface AddSubjectProps {
  isOpen: boolean;
  success(subject: any): void;
  close(): void;
  requestFailed(e: string): void;
}

const AddSubjectDialog: React.FC<AddSubjectProps> = (props) => {
  const [subjects, setSubjects] = React.useState([] as any[]);
  const [subject, setSubject] = React.useState(null as any);

  const loadSubjects = async () => {
    const loadedSubjects = await getSubjects();
    if (loadedSubjects) {
      setSubjects(loadedSubjects);
    } else {
      props.requestFailed('Can`t load subjects');
    }
  }

  useEffect(() => { loadSubjects() }, []);

  const addSubject = async () => {
    //const subjects =  props.user.subjects.map(s => s.id);
    props.close();
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
              <MenuItem>
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

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

const connector = connect(null, mapDispatch);

export default connector(AddSubjectDialog);
