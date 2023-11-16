import React, { useState } from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import { Checkbox, ListItemIcon, ListItemText, MenuItem, Popper, SvgIcon } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import './CreateClassDialog.scss';
import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import { stripHtml } from 'components/build/questionService/ConvertService';
import { Brick, Subject } from 'model/brick';
import { deleteAssignment, getSuggestedByTitles, hasPersonalBricks } from 'services/axios/brick';
import { assignClasses, sendAsignEmail } from 'services/axios/assignBrick';
import map from 'components/map';

import BrickTitle from 'components/baseComponents/BrickTitle';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { Classroom } from 'model/classroom';
import { GetClassAssignedBricks, SetClassroomAssignedBricks, UnsetClassroomAssignedBricks } from 'localStorage/assigningBricks';

interface AssignClassProps {
  isOpen: boolean;
  subjects: Subject[];

  classroom: Classroom;

  submit(classroomId: number): void;
  close(): void;

  user: User;
  history: any;
}

const PopperCustom = function (props: any) {
  return (<Popper {...props} className="assign-brick-class-poopper" />)
}

const AssignBrickClassDialog: React.FC<AssignClassProps> = (props) => {
  const [classroom, setClassroom] = useState(null as any);

  const [hasPersonal, setHasPersonal] = useState(false);

  const [sendEmail, setSendEmail] = useState(false);

  const [assignments, setAssignments] = useState([] as any[]);
  const [bricks, setBricks] = useState([] as any[]);

  const [searchText, setSearchText] = useState('');

  React.useEffect(() => {
    if (props.classroom) {
      const cashedClass = GetClassAssignedBricks();
      if (cashedClass && cashedClass.id === props.classroom.id) {
        let cashAssignments = [];
        if (cashedClass.cashAssignments) {
          cashAssignments = cashedClass.cashAssignments.filter((a: any) => a != null);
        }
        console.log('set assignemnts', cashAssignments);
        setAssignments(cashAssignments);
      }
  
      setClassroom(props.classroom);
    }
  }, [props.classroom]);

  const setPersonal = async () => {
    const hasPersonal = await hasPersonalBricks();
    setHasPersonal(hasPersonal);
  }

  React.useEffect(() => {
    setPersonal();
  }, []);

  return (<div>
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box light-blue assign-class-dialog create-classroom-dialog"
    >
      <div className="dialog-header">
        <div className="title-box">
          <div className="title font-18">
            Add Assignments to Class
          </div>
          <SpriteIcon onClick={props.close} name="cancel-custom" />
        </div>
        <div className="text-block">
          <div className="text-r324 font-14">
            If you have the title you’re looking for enter it below
            <Autocomplete
              freeSolo
              options={bricks}
              onChange={async (e: any, brickV5: any) => {
                if (classroom && brickV5) {
                  const newAssignments = [...assignments];
                  const found = newAssignments.find(b => b.id === brickV5.id);
                  if (!found) {
                    const result = await assignClasses(brickV5.id, { classesIds: [classroom.id] });

                    if (result.success) {
                      if (result.result.newAssignments.length > 0) {
                        const assignmentsTotal = [...assignments, result.result.newAssignments[0]];
                        const classCopy = Object.assign(classroom);
                        classCopy.cashAssignments = assignmentsTotal;
                        SetClassroomAssignedBricks(classCopy);
                        setAssignments(assignmentsTotal);
                        setSearchText('');
                        setBricks([]);
                      }
                    }
                  }
                }
              }}
              noOptionsText="Sorry, try typing something else"
              className="subject-autocomplete"
              PopperComponent={PopperCustom}
              getOptionLabel={(option: any) => stripHtml(option.title)}
              renderOption={(brick: Brick) => {
                const subject = props.subjects.find(s => s.id === brick.subjectId);
                return (
                  <React.Fragment>
                    <MenuItem>
                      <ListItemIcon>
                        <SvgIcon>
                          <SpriteIcon
                            name="circle-filled"
                            className="w100 h100 active"
                            style={{ color: subject?.color || '' }}
                          />
                        </SvgIcon>
                      </ListItemIcon>
                      <ListItemText>
                        <BrickTitle title={brick.title} />
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
                          let searchBricks = await getSuggestedByTitles(e.target.value);

                          if (searchBricks) {
                            // remove assigned bricks
                            let lockedAssignments = [];
                            if (classroom && classroom.assignments) {
                              lockedAssignments.push(...classroom.assignments);
                            }

                            if (classroom && classroom.cashAssignments) {
                              lockedAssignments.push(...classroom.cashAssignments);
                            }

                            let filtered = [];
                            if (lockedAssignments) {
                              for (let brick of searchBricks) {
                                let found = lockedAssignments.find((a: any) => a.brick.id === parseInt(brick.id as any));
                                console.log(brick, found);
                                if (!found) {
                                  filtered.push(brick);
                                }
                              }
                            }

                            setBricks(filtered.map(s => s.body));
                          }
                        }
                      }}
                      placeholder="Brick title"
                    />
                  </div>
                )
              }}
            />
          </div>
          <div className="or-text bold font-14">
            OR
          </div>
          <div className="flex-center">
            <div className={`btn btn-glasses flex-center ${hasPersonal ? '' : 'one-button'}`} onClick={() => {
              props.history.push(map.ViewAllPage + '?assigning-bricks=' + classroom.id + '&only-bricks=true');
            }}>
              <div className="flex-center">
                <SpriteIcon name="glasses-home" />
              </div>
              <div className="flex-center font-14">
                Browse Public Catalogue
              </div>
            </div>
            {hasPersonal &&
              <div className="btn btn-key flex-center" onClick={() => {
                props.history.push(map.ViewAllPage + '?assigning-bricks=' + classroom.id + '&personal=true' + '&only-bricks=true');
              }}>
                <div className="flex-center">
                  <SpriteIcon name="key" />
                </div>
                <div className="flex-center font-14">
                  Personal Bricks
                </div>
              </div>}
          </div>
          <div className="bold text-left m-top-small font-16">
            Assigned Bricks
          </div>
          {assignments.length > 0
            ?
            <div className="bricks-box">
              {assignments.map((a, i) => {
                let additionalClass = 'down-border';
                if (i === assignments.length - 1) {
                  additionalClass = '';
                }
                return (<div className={`brick-row bold font-12 ${additionalClass}`} key={i}>
                  {stripHtml(a.brick.title)}
                  <SpriteIcon name="cancel-custom" onClick={async () => {
                    const res = await deleteAssignment(a.id);
                    if (res) {
                      const filteredAssignments = assignments.filter(bs => bs.id !== a.id);
                      setAssignments(filteredAssignments);
                    }
                  }} />
                </div>
                );
              })}
            </div>
            :
            <div className="bricks-box empty flex-center font-12">
              No bricks yet
            </div>
          }
          <div className="flex-y-center" onClick={() => setSendEmail(!sendEmail)}>
            <Checkbox checked={sendEmail} />
            <div className="font-12">Send existing learners an email notification when finished</div>
          </div>
        </div>
      </div>
      <div className="dialog-footer">
        <div className="info-box" />
        <div className="message-box-r5 font-11" />
        <button
          className="btn btn-md bg-theme-green font-16 yes-button"
          onClick={() => {
            if (sendEmail) {
              sendAsignEmail(assignments.map(a => a.id), classroom.id);
            }
            UnsetClassroomAssignedBricks();
            props.submit(classroom.id);
            props.close();
          }}
        >
          <span className="bold">Done</span>
        </button>
      </div>
    </Dialog>
  </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });
const connector = connect(mapState);

export default connector(AssignBrickClassDialog);
