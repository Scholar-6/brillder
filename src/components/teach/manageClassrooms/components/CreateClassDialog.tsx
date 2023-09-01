import React, { useState } from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import * as QRCode from "qrcode";
import { ListItemIcon, ListItemText, MenuItem, Popper, SvgIcon } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import './CreateClassDialog.scss';
import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import AutocompleteUsernameButEmail from 'components/play/baseComponents/AutocompleteUsernameButEmail';
import { stripHtml } from 'components/build/questionService/ConvertService';
import { Brick, Subject } from 'model/brick';
import { getSuggestedByTitles } from 'services/axios/brick';
import { createClass, getClassById } from 'components/teach/service';
import { assignClasses } from 'services/axios/assignBrick';
import { assignToClassByEmails } from 'services/axios/classroom';
import map from 'components/map';

import BrickTitle from 'components/baseComponents/BrickTitle';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import HoverHelp from 'components/baseComponents/hoverHelp/HoverHelp';
import { Classroom } from 'model/classroom';

interface AssignClassProps {
  isOpen: boolean;
  subjects: Subject[];

  classroom?: Classroom;

  submit(classroomId: number): void;
  close(): void;

  user: User;
  history?: any;
}

const PopperCustom = function (props: any) {
  return (<Popper {...props} className="assign-brick-class-poopper" />)
}

const CreateClassDialog: React.FC<AssignClassProps> = (props) => {
  const [imgBase64, setImageBase64] = useState('');

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
    }
  }, [props.classroom]);

  const [assignments, setAssignments] = useState([] as any[]);
  const [bricks, setBricks] = useState([] as any[]);

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

    if (canSubmit === false || value === '') {
      return;
    }

    if (value) {
      // creating new class
      if (!classroom) {
        const newClassroom = await createClass(value);
        setClassroom(newClassroom);

        if (newClassroom) {
          // after assigning get class with assignments
          const resultClass = await getClassById(newClassroom.id);
          if (resultClass) {
            setClassroom(resultClass);
          }

          writeQRCode(
            window.location.protocol + '//' + window.location.host + `/${map.QuickassignPrefix}/` + newClassroom.code
          );
        }
      } else {
        // after assigning get class with assignments
        const resultClass = await getClassById(classroom.id);
        if (resultClass) {
          setClassroom(resultClass);
        }
      }
    }
    setSaving(false);
    setThirdOpen(true);
  }

  const createV2 = async (value: string) => {
    if (isSaving) { return; }
    setSaving(true);

    if (canSubmit === false || value === '') {
      return;
    }

    if (value) {
      // creating new class
      if (!classroom) {
        const newClassroom = await createClass(value);
        setClassroom(newClassroom);

        if (newClassroom) {
          writeQRCode(
            window.location.protocol + '//' + window.location.host + `/${map.QuickassignPrefix}/` + newClassroom.code
          );
        }
      } else {
        // after assigning get class with assignments
        const resultClass = await getClassById(classroom.id);
        if (resultClass) {
          setClassroom(resultClass);
        }
      }
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

  console.log(assignments);

  return (<div>
    <Dialog
      open={props.isOpen && !secondOpen}
      onClose={props.close}
      className="dialog-box light-blue assign-class-dialog create-classroom-dialog"
    >
      <div className="dialog-header">
        <div className="title-box">
          <div className="title">New Class</div>
          <SpriteIcon name="cancel-custom" onClick={props.close} />
        </div>
        <div className="text-block">
          <div className="text-r324">Enter the name of your class</div>
          <div className="r-class-inputs">
            <input placeholder="Class Name" value={value} onChange={e => {
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
        <div className="message-box-r5">
          Add a name that will be recognisable later to you and to your students, for example: <span className="italic">Year 11 French 2023.</span>
        </div>
        <button
          className="btn btn-md cancel-button"
          onClick={props.close}
        >
          <span className="bold">Cancel</span>
        </button>
        <button
          className={`btn btn-md bg-theme-green yes-button ${!canSubmit ? 'invalid' : ''}`}
          onClick={() => createV2(value) }
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
          <div className="title">
            Add Assignments to Class
          </div>
          <SpriteIcon onClick={closeV2} name="cancel-custom" />
        </div>
        <div className="text-block">
          <div className="text-r324">
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
                    await assignClasses(brickV5.id, { classesIds: [classroom.id], deadline: null });
                    const classroomV2 = await getClassById(classroom.id);
                    console.log(5656556, classroomV2);
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
          <div className="or-text bold">
            OR
          </div>
          <div className="flex-center">
            <div className="btn btn-glasses flex-center" onClick={() => {
              props.history.push(map.ViewAllPage  + '?assigning-bricks=' + classroom.id);
            }}>
              <div className="flex-center">
                <SpriteIcon name="glasses-home" />
              </div>
              <div className="flex-center">
                Browse the catalogue
              </div>
            </div>
            <div className="btn btn-key flex-center" onClick={() => {
              props.history.push(map.ViewAllPage  + '?assigning-bricks=' + classroom.id +'&personal=true');
            }}>
              <div className="flex-center">
                <SpriteIcon name="key" />
              </div>
              <div className="flex-center">
                Personal Bricks
              </div>
            </div>
          </div>
          <div className="bold text-left">
            Bricks Added
          </div>
          {assignments.length > 0
            ?
            <div className="bricks-box">
              {assignments.map((a, i) => {
                let additionalClass = 'down-border';
                if (i === assignments.length - 1) {
                  additionalClass = '';
                }
                return (<div className={`brick-row bold ${additionalClass}`} key={i}>
                  {stripHtml(a.brick.title)}
                  <SpriteIcon name="cancel-custom" onClick={() => {
                    const filteredAssignments = assignments.filter(bs => bs.id !== a.brick.id);
                    setAssignments(filteredAssignments);
                  }} />
                </div>
                );
              })}
            </div>
            :
            <div className="bricks-box empty flex-center">
              No bricks yet
            </div>
          }
        </div>
      </div>
      <div className="dialog-footer">
        <div className="info-box">
          <SpriteIcon name="info-icon" />
        </div>
        <div className="message-box-r5">
          You can skip this step for now and assign bricks to the class later from the Manage Classes menu.
        </div>
        <button
          className="btn btn-md cancel-button"
          onClick={() => setSecondOpen(false)}
        >
          <span className="bold">Previous</span>
        </button>
        <button
          className={`btn btn-md bg-theme-green yes-button ${(value === '' || !canSubmit) ? 'invalid' : ''}`}
          onClick={create}
        >
          <span className="bold">Next</span>
        </button>
      </div>
    </Dialog>
    <Dialog
      open={props.isOpen && closeV2Open}
      onClose={props.close}
      className="dialog-box light-blue assign-class-dialog create-classroom-dialog"
    >
      <div className="dialog-header">
        <div className="title-box">
          <div className="title">
            Are you sure you want to quit Class Creation?
          </div>
          <SpriteIcon onClick={props.close} name="cancel-custom" />
        </div>
        <div className="text-block">
          <div className="text-r324">
            Class including any added bricks or students will not be saved. Click ‘Stay’ to continue editing, or ‘Quit’ to discard the changes and exit the process.
          </div>
        </div>
      </div>
      <div className="dialog-footer">
        <div className="info-box">
        </div>
        <div className="message-box-r5"></div>
        <button
          className="btn btn-md cancel-button"
          onClick={() => {
            setCloseV2Open(false);
            props.close();
          }}
        >
          <span className="bold">Quit</span>
        </button>
        <button
          className={`btn btn-md bg-theme-green yes-button ${(value === '' || !canSubmit) ? 'invalid' : ''}`}
          onClick={() => setCloseV2Open(false)}
        >
          <span className="bold">Stay</span>
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
            <div className="title">
              Sharing and Invites
            </div>
            <SpriteIcon onClick={closeV2} name="cancel-custom" />
          </div>
          <div className="text-block two-columns">
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
              <div className="gray-box">
                <input id="classroom-code-vr3" value={classroom.code} />
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
                } />
                <div className="copy-btn">Copy</div>
              </div>
              {expandedV3Popup &&
                <div>
                  <div className="or-text-v2 bold">OR</div>
                  <div className="bold text-left left-padding-v2">Invite learners by email</div>
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
                      <span>
                        Students might not receive invites if your institution filters emails. <span className="underline bold">How to avoid this</span>
                        <SpriteIcon name="arrow-down" />
                      </span>
                    </div>
                  </div>}
                </div>}
            </div>
            <div className="block-two">
              {!expandedV3Popup && <div className="text-left">Share QR code</div>}
              <div className={`code-box flex-center ${expandedV3Popup ? 'expanded' : ''}`}>
                <SpriteIcon className="expand-btn" name="collapse" onClick={() => expandV3Popup(!expandedV3Popup)} />
                <img className="qr-code-img" src={imgBase64} />
                {expandedV3Popup && <div className="absolute-code-label">Class Code: <span className="bold">{classroom.code}</span></div>}
              </div>
            </div>
          </div>
          {!expandedV3Popup &&
            <div className="bottom-box-padding">
              <div className="or-text-v2 bold">OR</div>
              <div className="bold text-left left-padding-v2">Invite learners by email</div>
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
                  <span>
                    Students might not receive invites if your institution filters emails. <span className="underline bold">How to avoid this</span>
                  </span>
                  <SpriteIcon name="arrow-down" className={expandedWarning ? 'arrow-up' : ''} onClick={() => {
                    expandWarning(!expandedWarning)
                  }} />
                </div>
                {expandedWarning &&
                  <div>
                    <span>To ensure invites are received, please ask your network administrator to whitelist notifications@brillder.com. They may want the following information:</span>
                  </div>}
                {expandedWarning &&
                  <div>
                    <span>Brillder is the trading name of Scholar 6 Ltd, which is on the UK Register of Learning Providers (UK Provider Reference Number 10090571)</span>
                  </div>}
              </div>}
            </div>}
        </div>
        <div className="dialog-footer one-line">
          <div className="info-box">
            <SpriteIcon name="info-icon" />
          </div>
          <div className="message-box-r5">
            These options can be accessed again later from the Share menu on the Class page
          </div>
          <button
            className="btn btn-md cancel-button"
            onClick={() => setThirdOpen(false)}
          >
            <span className="bold">Previous</span>
          </button>
          <button
            className={`btn btn-md bg-theme-green yes-button ${!canSubmitV2 ? 'invalid' : ''}`}
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

export default connector(CreateClassDialog);
