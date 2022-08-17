import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Subject } from 'model/brick';
import { InputBase, ListItemIcon, ListItemText, MenuItem, Select, SvgIcon } from '@material-ui/core';
import { connect } from 'react-redux';

import './CreateClassDialog.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { User, UserType } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import { getSubjects } from 'services/axios/subject';

interface AssignClassProps {
  isOpen: boolean;
  submit(value: string, subject: Subject): void;
  close(): void;

  user: User;
}

const CreateClassDialog: React.FC<AssignClassProps> = (props) => {
  const [value, setValue] = React.useState("");
  const [subjectIndex, setSubjectIndex] = React.useState<number>();

  const [subjects, setSubjects] = React.useState<Subject[]>();
  React.useEffect(() => {
    const initAllSubjects = async () => {

      const setAdminSubjects = async () => {
        const subs = await getSubjects();
        if (subs) {
          setSubjects(subs);
        }
      }

      const setUsersSubjects = async () => {
        const subs = await getSubjects();
        if (subs) {
          let sortedSubjects = [...props.user.subjects];

          for (let subject of subs) {
            let found = sortedSubjects.find(s => s.id === subject.id);
            if (!found) {
              sortedSubjects.push(subject);
            }
          }
          setSubjects(sortedSubjects);
        }
      }

      if (!subjects) {
        if (props.user.roles.some(role => role.roleId === UserType.Admin)) {
          setAdminSubjects();
        } else {
          setUsersSubjects();
        }
      }
    }

    initAllSubjects();
  }, [props.user.roles, props.user.subjects]);

  React.useEffect(() => {
    if (subjects && subjects.length === 1) {
      setSubjectIndex(subjects.findIndex(s => s.name === "General") ?? 0);
    }
  }, [subjects])

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box light-blue assign-class-dialog create-classroom-dialog"
    >
      <div className="close-button svgOnHover" onClick={props.close}>
        <SpriteIcon name="cancel" className="w100 h100 active" />
      </div>
      <div className="dialog-header" style={{ marginBottom: '2vh' }}>
        <div className="title">Name Your Class</div>
        <input placeholder="Class Name" value={value} onChange={e => setValue(e.target.value)} />
      </div>
      <div className="dialog-header dialog-select-container">
        {(subjectIndex === -1 || subjectIndex === undefined) && <div className="absolute-placeholder unselectable" onClick={e => e.preventDefault()}>Choose a Subject</div>}
        <Select
          MenuProps={{ style: { zIndex: 1000000 }, classes: { paper: 'select-classes-list' } } /* Dialog box is always z-index 999999 */}
          value={subjectIndex}
          onChange={(evt) => setSubjectIndex(evt.target.value as number)}
          input={<InputBase />}
        >
          {subjects?.map((s, i) => (
            <MenuItem value={i} key={i}>
              <ListItemIcon>
                <SvgIcon>
                  <SpriteIcon
                    name="circle-filled"
                    className="w100 h100 active"
                    style={{ color: s.color }}
                  />
                </SvgIcon>
              </ListItemIcon>
              <ListItemText>{s.name}</ListItemText>
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={() => {
            if (value && subjects && subjectIndex !== undefined && subjects[subjectIndex]) {
              props.submit(value, subjects[subjectIndex]);
            }
          }}>
          <span className="bold">Create</span>
        </button>
      </div>
    </Dialog>
  );
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });
const connector = connect(mapState);

export default connector(CreateClassDialog);