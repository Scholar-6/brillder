import React, { useState } from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import * as QRCode from "qrcode";

import './CreateClassDialog.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { Checkbox, ListItemIcon, ListItemText, MenuItem, Popper, SvgIcon } from '@material-ui/core';
import AutocompleteUsernameButEmail from 'components/play/baseComponents/AutocompleteUsernameButEmail';
import { stripHtml } from 'components/build/questionService/ConvertService';
import { Brick, Subject } from 'model/brick';
import { getSuggestedByTitles } from 'services/axios/brick';
import BrickTitle from 'components/baseComponents/BrickTitle';
import { createClass, getClassById } from 'components/teach/service';
import { assignClasses } from 'services/axios/assignBrick';
import { assignToClassByEmails, updateClassroom } from 'services/axios/classroom';
import map from 'components/map';

interface AssignClassProps {
  isOpen: boolean;
  subjects: Subject[];

  submit(value: string, users: User[]): void;
  close(): void;

  user: User;
  history?: any;
}

const PopperCustom = function (props: any) {
  return (<Popper {...props} className="assign-brick-class-poopper" />)
}

const CreateClassDialog: React.FC<AssignClassProps> = (props) => {
  const [imgBase64, setImageBase64] = React.useState('');

  const [canSubmitV2, setSubmitV2] = React.useState(true);
  const [closeV2Open, setCloseV2Open] = React.useState(false);

  const [sendEmails, setSendEmails] = React.useState(false);

  const [secondOpen, setSecondOpen] = React.useState(false);
  const [thirdOpen, setThirdOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [canSubmit, setSubmit] = React.useState(false);
  const [isSaving, setSaving] = React.useState(false);

  const [classroom, setClassroom] = React.useState(null as any);

  const [selectedBricks, selectBricks] = useState([] as any[]);
  const [bricks, setBricks] = useState([] as any[]);

  const [searchText, setSearchText] = useState('');

  const [currentEmail, setCurrentEmail] = React.useState("");
  const [users, setUsers] = React.useState<User[]>([]);

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
          for (let selectedBrick of selectedBricks) {
            await assignClasses(selectedBrick.id, { classesIds: [newClassroom.id], deadline: null });
          }

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
        // updating classroom
        const bricks = selectedBricks.filter(b => {
          const found = classroom.assignments.find((a: any) => {
            return a.brick.id === parseInt(b.id)
          });
          if (found) {
            return false;
          }
          return true;
        })
        for (const selectedBrick of bricks) {
          await assignClasses(selectedBrick.id, { classesIds: [classroom.id], deadline: null });
        }
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

  const assignStudentsToBrick = async () => {
    // assign students to class
    const currentUsers = users;
    if (!emailRegex.test(currentEmail)) {
    } else {
      setUsers(users => [...users, { email: currentEmail } as User]);
      currentUsers.push({ email: currentEmail } as User);
      setCurrentEmail("");
    }

    const res = await assignToClassByEmails(classroom, currentUsers.map(u => u.email), !sendEmails);
    if (res) {
      //props.history.push(`${map.TeachAssignedTab}?classroomId=${newClassroom.id}&${map.NewTeachQuery}&assignmentExpanded=true`);
    }
    //await getClasses();
    setSecondOpen(false);
    setThirdOpen(false);
    props.close();
  }

  const closeV2 = () => {
    setCloseV2Open(true);
  }

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
          onClick={async () => {
            if (canSubmit) {
              setSecondOpen(true);
              if (classroom) {
                classroom.name = value;
                await updateClassroom({ ...classroom });
              }
            }
          }}
        >
          <span className="bold">Next</span>
        </button>
      </div>
    </Dialog>
    <Dialog
      open={props.isOpen && secondOpen && !closeV2Open && !thirdOpen}
      onClose={props.close}
      className="dialog-box light-blue assign-class-dialog create-classroom-dialog"
    >
      <div className="dialog-header">
        <div className="title-box">
          <div className="title">
            Add Assignment to Class
          </div>
          <SpriteIcon onClick={closeV2} name="cancel-custom" />
        </div>
        <div className="text-block">
          <div className="text-r324">
            If you have the title you’re looking for enter it below
            <Autocomplete
              freeSolo
              options={bricks}
              onChange={(e: any, v: any) => {
                setSearchText(stripHtml(v.title));
                const newBricks = [...selectedBricks];
                const found = newBricks.find(b => b.id === v.id);
                if (!found) {
                  newBricks.push(v);
                  selectBricks(newBricks)
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
              props.history.push(map.ViewAllPage);
            }}>
              <div className="flex-center">
                <SpriteIcon name="glasses-home" />
              </div>
              <div className="flex-center">
                Browse the catalogue
              </div>
            </div>
          </div>
          <div className="bold text-left">
            Bricks Added
          </div>
          {selectedBricks.length > 0
            ?
            <div className="bricks-box">
              {selectedBricks.map((b, i) => {
                let additionalClass = 'down-border';
                if (i === selectedBricks.length - 1) {
                  additionalClass = '';
                }
                return (<div className={`brick-row bold ${additionalClass}`}>
                  {stripHtml(b.title)}
                  <SpriteIcon name="cancel-custom" onClick={() => {
                    const filteredBricks = selectedBricks.filter(bs => bs.id !== b.id);
                    selectBricks(filteredBricks);
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
          You can skip this step for now and add bricks to the class later from the My Classes menu
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
      open={props.isOpen && closeV2Open && secondOpen && !thirdOpen}
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
          onClick={props.close}
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
    {props.isOpen && secondOpen && thirdOpen &&
      <Dialog
        open={props.isOpen && secondOpen && thirdOpen}
        onClose={props.close}
        className="dialog-box light-blue assign-class-dialog create-classroom-dialog longer"
      >
        <div className="dialog-header">
          <div className="title-box">
            <div className="title">
              Sharing and Invites
            </div>
            <SpriteIcon onClick={props.close} name="cancel-custom" />
          </div>
          <div className="text-block two-columns">
            <div className="block-one">
              <div className="bold text-left">
                Quick access
              </div>
              <div className="text-left test-r5-d3 with-help-icon">
                Share by code
                <SpriteIcon name="help-circle-custom" />
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
                <SpriteIcon name="help-circle-custom" />
              </div>
              <div className="gray-box underline-text">
                <input id="classroom-link-vr3" value={
                  document.location.host + '/' + map.QuickassignPrefix + '/' + classroom.code
                } />
                <div className="copy-btn">Copy</div>
              </div>
            </div>
            <div className="block-two">
              <div className="text-left">Share QR code</div>
              <div className="code-box flex-center">
                <img className="qr-code-img" src={imgBase64} />
              </div>
            </div>
          </div>
          <div className="or-text-v2 bold">OR</div>
          <div className="bold text-left left-padding-v2">Add learners by email address</div>
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
            Students might not receive invites if your institution filters emails. <span className="underline bold">How to avoid this</span>
            <SpriteIcon name="arrow-down" />
          </div>}
          <div></div>
          {/*
          <div className="send-email-box">
            <Checkbox checked={sendEmails} onClick={() => setSendEmails(!sendEmails)} />
            Send email invitations when finished
            </div>*/}
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
