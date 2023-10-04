import React, { useState } from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import * as QRCode from "qrcode";
import { ListItemIcon, ListItemText, MenuItem, Popper, SvgIcon } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import AutocompleteUsernameButEmail from 'components/play/baseComponents/AutocompleteUsernameButEmail';
import { stripHtml } from 'components/build/questionService/ConvertService';
import { Brick, Subject } from 'model/brick';
import { deleteAssignment, getSuggestedByTitles, hasPersonalBricks } from 'services/axios/brick';
import { getClassById } from 'components/teach/service';
import { assignClasses } from 'services/axios/assignBrick';
import { assignToClassByEmails, deleteClassroom, searchClassroomsByName } from 'services/axios/classroom';
import map from 'components/map';

import BrickTitle from 'components/baseComponents/BrickTitle';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import HoverHelp from 'components/baseComponents/hoverHelp/HoverHelp';
import { Classroom } from 'model/classroom';

interface AssignClassProps {
  isOpen: boolean;
  subjects: Subject[];

  classroom?: Classroom;

  brick: Brick;

  submit(classroomId: number): void;
  close(): void;

  user: User;
  history?: any;
}

const PopperCustom = function (props: any) {
  return (<Popper {...props} className="assign-brick-class-poopper" />)
}

const AddToClassDialog: React.FC<AssignClassProps> = (props) => {
  const [imgBase64, setImageBase64] = useState('');

  const [multiple, setMultiple] = useState(false);

  const [expandedWarning, expandWarning] = useState(false);

  const [canSubmitV2, setSubmitV2] = useState(true);
  const [closeV2Open, setCloseV2Open] = useState(false);

  const [expandedV3Popup, expandV3Popup] = useState(false);

  const [secondOpen, setSecondOpen] = useState(false);
  const [thirdOpen, setThirdOpen] = useState(false);
  const [value, setValue] = useState("");
  const [canSubmit, setSubmit] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const [classroom, setClassroom] = useState(null as any);

  React.useEffect(() => {
    if (props.classroom) {
      setClassroom(props.classroom);
      setSecondOpen(true);
      setValue(props.classroom.name);
      props.classroom.assignments.sort((c1, c2) => {
        return c1.assignedDate > c2.assignedDate ? -1 : 1;
      });
      setAssignments(props.classroom.assignments);
      setSubmit(true);

      if (props.classroom.code) {
        writeQRCode(
          window.location.protocol + '//' + window.location.host + `/${map.QuickassignPrefix}/` + props.classroom.code
        );
      }
    }
  }, [props.classroom]);

  const setPersonal = async () => {
    const hasPersonal = await hasPersonalBricks();
    setHasPersonal(hasPersonal);
  }

  React.useEffect(() => {
    setPersonal();
  }, []);

  const [hasPersonal, setHasPersonal] = useState(false);

  const [assignments, setAssignments] = useState([] as any[]);
  const [bricks, setBricks] = useState([] as any[]);

  const [classrooms, setClassrooms] = useState([] as any[]);

  const [searchText, setSearchText] = useState('');

  const [currentEmail, setCurrentEmail] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  //eslint-disable-next-line
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const writeQRCode = (str: string) => {
    QRCode.toDataURL(str, {
      width: 600,
      height: 600
    } as QRCode.QRCodeToDataURLOptions, (err, dataURL) => {
      setImageBase64(dataURL);
    });
  }

  const addUser = (email: string) => {
    if (!emailRegex.test(email)) { return; }
    setCurrentEmail('');
    setUsers(users => [...users, { email } as User]);
    setSubmitV2(true);
  }

  const onAddUser = React.useCallback(() => {
    if (!emailRegex.test(currentEmail)) { return; }
    setCurrentEmail('');
    setUsers(users => [...users, { email: currentEmail } as User]);
    setSubmitV2(true);
    //eslint-disable-next-line
  }, [currentEmail]);

  const checkSpaces = (email: string) => {
    const emails = email.split(' ');
    if (emails.length >= 2) {
      for (let email of emails) {
        addUser(email);
      }
    } else {
      setCurrentEmail(email.trim());
    }
  }

  const create = async () => {
    if (isSaving) { return; }
    setSaving(true);

    // add brick to classroom or classrooms

    setSaving(false);
    setThirdOpen(true);
  }

  const addToClass = async () => {
    console.log('add to class', isSaving, canSubmit, classroom)
    if (isSaving) { return; }
    setSaving(true);

    if (canSubmit === false || !classroom) {
      console.log('can`t save')
      setSaving(false);
      return;
    }

    console.log('assigning');

    const res = await assignClasses(props.brick.id, { classesIds: [classroom.id] });

    console.log(res);

    if (res) {
      const classroomV2 = await getClassById(classroom.id);
      if (classroomV2 && classroomV2.assignments) {
        classroomV2.assignments.sort((c1, c2) => {
          return c1.assignedDate > c2.assignedDate ? -1 : 1;
        });
        setAssignments(classroomV2.assignments);
      }
      setClassroom(classroomV2);
    }

    setSaving(false);
    setSecondOpen(true);
  }

  const assignStudentsToBrick = async () => {
    // assign students to class
    const currentUsers = users;
    if (!emailRegex.test(currentEmail)) {
    } else {
      setUsers(users => [...users, { email: currentEmail } as User]);
      currentUsers.push({ email: currentEmail } as User);
      setCurrentEmail("");
    }

    const res = await assignToClassByEmails(classroom, currentUsers.map(u => u.email));

    if (res) {
      props.history.push(`${map.TeachAssignedTab}?classroomId=${classroom.id}&${map.NewTeachQuery}&assignmentExpanded=true`);
    }
    setSecondOpen(false);
    setThirdOpen(false);
    props.submit(classroom.id);
  }

  const closeV2 = () => {
    setCloseV2Open(true);
  }

  const deleteClass = async () => {
    const deleted = await deleteClassroom(classroom.id);
    if (deleted) {
      setCloseV2Open(false);
      props.close();
    }
  }

  return (<div>
    <Dialog
      open={props.isOpen && !secondOpen}
      onClose={props.close}
      className="dialog-box light-blue assign-class-dialog create-classroom-dialog new-class-r5"
    >
      <div className="dialog-header">
        <div className="title-box">
          <div className="title font-18">Add to Class</div>
          <SpriteIcon name="cancel-custom" onClick={props.close} />
        </div>
        <div className="text-block">
          <div className="text-r324 font-14">Find your class</div>
          <div className="r-class-inputs search-class-box">
            <Autocomplete
              value={classroom}
              options={classrooms}
              onChange={async (e: any, classV2: any) => {
                if (classV2) {
                  const classroomV2 = await getClassById(classV2.id);
                  if (classroomV2 && classroomV2.assignments) {
                    classroomV2.assignments.sort((c1, c2) => {
                      return c1.assignedDate > c2.assignedDate ? -1 : 1;
                    });
                    setAssignments(classroomV2.assignments);
                  }
                  setClassroom(classroomV2);
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
        <div className="message-box-r5 clickable-btn flex-y-center font-16 bold" onClick={() => {
          setMultiple(true);
        }}>
          Add to multiple classes
        </div>
        <button
          className="btn btn-md font-16 cancel-button"
          onClick={props.close}
        >
          <span className="bold">Cancel</span>
        </button>
        <button
          className={`btn btn-md bg-theme-green font-16 yes-button ${!canSubmit ? 'invalid' : ''}`}
          onClick={addToClass}
        >
          <span className="bold">Next</span>
        </button>
      </div>
    </Dialog>
    <Dialog
      open={props.isOpen && secondOpen && !closeV2Open && !thirdOpen}
      onClose={closeV2}
      className="dialog-box light-blue assign-class-dialog create-classroom-dialog"
    >
      <div className="dialog-header">
        <div className="title-box">
          <div className="title font-18">
            Add Assignments to Class
          </div>
          <SpriteIcon onClick={closeV2} name="cancel-custom" />
        </div>
        <div className="text-block">
          <div className="text-r324 font-14">
            If you have the title you’re looking for enter it below
            <Autocomplete
              freeSolo
              options={bricks}
              onChange={async (e: any, brickV5: any) => {
                if (classroom) {
                  setSearchText(stripHtml(brickV5.title));
                  const newAssignments = [...assignments];
                  const found = newAssignments.find(b => b.id === brickV5.id);
                  if (!found) {
                    await assignClasses(brickV5.id, { classesIds: [classroom.id] });
                    const classroomV2 = await getClassById(classroom.id);
                    if (classroomV2 && classroomV2.assignments) {
                      classroomV2.assignments.sort((c1, c2) => {
                        return c1.assignedDate > c2.assignedDate ? -1 : 1;
                      });
                      setAssignments(classroomV2.assignments);
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
                          const searchBricks = await getSuggestedByTitles(e.target.value);
                          if (searchBricks) {
                            setBricks(searchBricks.map(s => s.body));
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
              props.history.push(map.ViewAllPage + '?assigning-bricks=' + classroom.id);
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
                props.history.push(map.ViewAllPage + '?assigning-bricks=' + classroom.id + '&personal=true');
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
        </div>
      </div>
      <div className="dialog-footer">
        <div className="info-box">
          {assignments.length > 0 ? '' : <SpriteIcon name="info-icon" />}
        </div>
        <div className="message-box-r5 font-11">
          {assignments.length > 0 ? '' : 'You can skip this step for now and assign bricks to the class later from the Manage Classes menu.'}
        </div>
        <button
          className="btn btn-md cancel-button font-16"
          onClick={() => setSecondOpen(false)}
        >
          <span className="bold">Previous</span>
        </button>
        <button
          className={`btn btn-md bg-theme-green font-16 yes-button ${(value === '' || !canSubmit) ? 'invalid' : ''}`}
          onClick={create}
        >
          <span className="bold">{assignments.length > 0 ? 'Next' : 'Skip'}</span>
        </button>
      </div>
    </Dialog>
    <Dialog
      open={props.isOpen && closeV2Open}
      onClose={() => {
        setThirdOpen(false);
        setCloseV2Open(false);
        props.close();
      }}
      className="dialog-box light-blue assign-class-dialog create-classroom-dialog delete-class-r5"
    >
      <div className="dialog-header">
        <div className="title-box">
          <div className="title font-18">
            Are you sure you want to quit Class Creation?
          </div>
          <SpriteIcon onClick={() => {
            setThirdOpen(false);
            setCloseV2Open(false);
            props.close();
          }} name="cancel-custom" />
        </div>
        <div className="text-block">
          <div className="text-r324 text-center font-14">
            If you want to return to the class later, select Save and Quit to make this class<br />
            available from the Manage Classes page. Alternatively, select Delete Class to cancel<br />
            class creation and discard any assigned bricks or students.
          </div>
        </div>
      </div>
      <div className="dialog-footer">
        <div className="info-box">
        </div>
        <div className="message-box-r5"></div>
        <button
          className="btn btn-md cancel-button font-16"
          onClick={deleteClass}
        >
          <span className="bold">Delete Class</span>
        </button>
        <button
          className={`btn btn-md bg-theme-green yes-button font-16 ${(value === '' || !canSubmit) ? 'invalid' : ''}`}
          onClick={() => {
            setCloseV2Open(false);
            props.submit(classroom.id);
            props.close();
          }}
        >
          <span className="bold">Save and Quit</span>
        </button>
      </div>
    </Dialog>
    {props.isOpen && secondOpen && thirdOpen && !closeV2Open &&
      <Dialog
        open={props.isOpen && secondOpen && thirdOpen && !closeV2Open}
        onClose={closeV2}
        className="dialog-box light-blue assign-class-dialog create-classroom-dialog longer"
      >
        <div className="dialog-header">
          <div className="title-box">
            <div className="title font-18">
              Sharing and Invites
            </div>
            <SpriteIcon onClick={closeV2} name="cancel-custom" />
          </div>
          <div className="text-block two-columns font-14">
            <div className="block-one">
              <div className="bold text-left">
                Quick access
              </div>
              <div className="text-left test-r5-d3 with-help-icon">
                Share by code
                <div className="share-popup-box">
                  <HoverHelp>
                    <div>
                      <div>Students can use this code to</div>
                      <div>access the class with the Class</div>
                      <div>Code option on <a className="bold" href="https://brillder.com">brillder.com</a></div>
                    </div>
                  </HoverHelp>
                </div>
              </div>
              <div className="gray-box font-14">
                <input id="classroom-code-vr3" value={classroom.code} className="font-14" />
                <div className="copy-btn" onClick={() => {
                  const linkEl = document.getElementById('classroom-code-vr3') as HTMLInputElement;
                  if (linkEl) {
                    linkEl.select();
                    linkEl.setSelectionRange(0, 20);
                    document.execCommand('copy');
                    linkEl.setSelectionRange(0, 0);
                  }
                }}>Copy</div>
              </div>
              <div className="text-left test-r5-d3 with-help-icon">
                Share by link
                <div className="share-popup-box">
                  <HoverHelp>
                    <div>
                      <div>Paste this link on a class site, or</div>
                      <div>into an email or other message to</div>
                      <div>your students</div>
                    </div>
                  </HoverHelp>
                </div>
              </div>
              <div className="gray-box underline-text">
                <input id="classroom-link-vr3" value={
                  document.location.host + '/' + map.QuickassignPrefix + '/' + classroom.code
                } className="font-14" />
                <div className="copy-btn" onClick={() => {
                  const linkEl = document.getElementById('classroom-link-vr3') as HTMLInputElement;
                  if (linkEl) {
                    linkEl.select();
                    linkEl.setSelectionRange(0, 100);
                    document.execCommand('copy');
                    linkEl.setSelectionRange(0, 0);
                  }
                }}>Copy</div>
              </div>
              {expandedV3Popup &&
                <div>
                  <div className="or-text-v2 font-14 bold">OR</div>
                  <div className="bold text-left left-padding-v2 font-16">Invite learners by email</div>
                  <div className="r-student-emails">
                    <AutocompleteUsernameButEmail
                      placeholder="Type or paste up to 50 learner emails, then press Enter ⏎"
                      currentEmail={currentEmail}
                      users={users}
                      onAddEmail={onAddUser}
                      onChange={email => checkSpaces(email.trim())}
                      setUsers={users => {
                        setCurrentEmail('');
                        setUsers(users as User[]);
                      }}
                      isEmpty={canSubmit}
                      setEmpty={setSubmitV2}
                    />
                  </div>
                  {users.length > 0 && <div className="email-warning">
                    <div>
                      <span className="font-12">
                        Students might not receive invites if your institution filters emails. <span className="underline bold">How to avoid this</span>
                        <SpriteIcon name="arrow-down" />
                      </span>
                    </div>
                  </div>}
                </div>}
            </div>
            <div className="block-two">
              {!expandedV3Popup && <div className="text-left test-r5-d4 with-help-icon">Share QR code
                <div className="share-popup-box">
                  <HoverHelp>
                    <div>
                      <div>The QR code can be expanded, or</div>
                      <div>downloaded for inclusion on a </div>
                      <div>presentation, poster, or similar</div>
                    </div>
                  </HoverHelp>
                </div>
              </div>}
              <div className={`code-box flex-center ${expandedV3Popup ? 'expanded' : ''}`}>
                <SpriteIcon className="expand-btn" name={expandedV3Popup ? "collapse" : "expand-v55"} onClick={() => expandV3Popup(!expandedV3Popup)} />
                <img className="qr-code-img" src={imgBase64} />
                {expandedV3Popup && <div className="absolute-code-label">Class Code: <span className="bold upper-text">{classroom.code}</span></div>}
              </div>
            </div>
          </div>
          {!expandedV3Popup &&
            <div className="bottom-box-padding">
              <div className="or-text-v2 font-14 bold">OR</div>
              <div className="bold text-left font-16 left-padding-v2">Invite learners by email</div>
              <div className="r-student-emails">
                <AutocompleteUsernameButEmail
                  placeholder="Type or paste up to 50 learner emails, then press Enter ⏎"
                  currentEmail={currentEmail}
                  users={users}
                  onAddEmail={onAddUser}
                  onChange={email => checkSpaces(email.trim())}
                  setUsers={users => {
                    setCurrentEmail('');
                    setUsers(users as User[]);
                  }}
                  isEmpty={canSubmit}
                  setEmpty={setSubmitV2}
                />
              </div>
              {users.length > 0 && <div className="email-warning">
                <div>
                  <span className="font-12">
                    Students might not receive invites if your institution filters emails. <span className="underline bold">How to avoid this</span>
                  </span>
                  <SpriteIcon name="arrow-down" className={expandedWarning ? 'arrow-up' : ''} onClick={() => {
                    expandWarning(!expandedWarning)
                  }} />
                </div>
                {expandedWarning &&
                  <div>
                    <span className="font-12">To ensure invites are received, please ask your network administrator to whitelist notifications@brillder.com. They may want the following information:</span>
                  </div>}
                {expandedWarning &&
                  <div>
                    <span className="font-12">Brillder is the trading name of Scholar 6 Ltd, which is on the UK Register of Learning Providers (UK Provider Reference Number 10090571)</span>
                  </div>}
              </div>}
            </div>}
        </div>
        <div className="dialog-footer one-line">
          <div className="info-box">
            <SpriteIcon name="info-icon" />
          </div>
          <div className="message-box-r5 font-11">
            These options can be accessed again later from the Share menu on the Class page
          </div>
          <button
            className="btn btn-md font-16 cancel-button"
            onClick={() => setThirdOpen(false)}
          >
            <span className="bold">Previous</span>
          </button>
          <button
            className={`btn btn-md bg-theme-green font-16 yes-button ${!canSubmitV2 ? 'invalid' : ''}`}
            onClick={assignStudentsToBrick}
          >
            <span className="bold">Finish</span>
          </button>
        </div>
      </Dialog>}
  </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });
const connector = connect(mapState);

export default connector(AddToClassDialog);
