import React, { useState } from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import * as QRCode from "qrcode";

import './CreateClassDialog.scss';
import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import AutocompleteUsernameButEmail from 'components/play/baseComponents/AutocompleteUsernameButEmail';
import {  Subject } from 'model/brick';
import { assignToClassByEmails } from 'services/axios/classroom';
import map from 'components/map';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import HoverHelp from 'components/baseComponents/hoverHelp/HoverHelp';
import { Classroom } from 'model/classroom';

interface AssignClassProps {
  isOpen: boolean;

  classroom: Classroom;

  submit(classroomId: number): void;
  close(): void;

  user: User;
  history?: any;
}

const UpdateClassDialog: React.FC<AssignClassProps> = (props) => {
  const {classroom} = props;
  const [imgBase64, setImageBase64] = useState('');

  const [expandedWarning, expandWarning] = useState(false);

  const [canSubmitV2, setSubmitV2] = useState(false);

  const [expandedV3Popup, expandV3Popup] = useState(false);

  const [canSubmit, setSubmit] = useState(false);
  const [isSaving, setSaving] = useState(false);

  React.useEffect(() => {
    if (classroom.code) {
      writeQRCode(classroom.code);
    }
  }, []);

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

  const assignStudentsToBrick = async () => {
    if(isSaving) { return; }
    setSaving(true);
    // assign students to class
    const currentUsers = users;
    if (!emailRegex.test(currentEmail)) {
    } else {
      setUsers(users => [...users, { email: currentEmail } as User]);
      currentUsers.push({ email: currentEmail } as User);
      setCurrentEmail("");
    }

    const res = await assignToClassByEmails(classroom as any, currentUsers.map(u => u.email));

    if (res) {
      props.history.push(`${map.TeachAssignedTab}?classroomId=${classroom.id}&${map.NewTeachQuery}&assignmentExpanded=true`);
    }
    props.submit(classroom.id);
    setSaving(false);
    props.close();
  }

  return (<div>
    {props.isOpen &&
      <Dialog
        open={props.isOpen}
        onClose={props.close}
        className="dialog-box light-blue assign-class-dialog create-classroom-dialog longer"
      >
        <div className="dialog-header">
          <div className="title-box">
            <div className="title font-18">
              Sharing and Invites
            </div>
            <SpriteIcon onClick={props.close} name="cancel-custom" />
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
                <input id="classroom-code-vr3" defaultValue={classroom.code} className="font-14" />
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
                <input id="classroom-link-vr3" defaultValue={
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
            className={`btn btn-md bg-theme-green font-16 yes-button ${!canSubmitV2 ? 'invalid' : ''}`}
            onClick={assignStudentsToBrick}
          >
            <span className="bold">{users.length > 0 ? 'Invite' : 'Skip'}</span>
          </button>
        </div>
      </Dialog>}
  </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });
const connector = connect(mapState);

export default connector(UpdateClassDialog);
