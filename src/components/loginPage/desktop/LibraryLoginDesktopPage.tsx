import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { History } from "history";
import axios from "axios";
import { ListItemText, MenuItem, Select } from '@material-ui/core';

import actions from "redux/actions/auth";
import { libraryLogin } from "services/axios/auth";
import LoginLogo from '../components/LoginLogo';
import map from "components/map";
import { getRealLibraries, RealLibrary } from "services/axios/realLibrary";
import ProfileInput from "components/userProfilePage/components/ProfileInput";
import LibraryFailedDialog from "components/baseComponents/dialogs/LibraryFailedDialog";

const mapDispatch = (dispatch: any) => ({
  loginSuccess: () => dispatch(actions.loginSuccess()),
});

const connector = connect(null, mapDispatch);

interface LoginProps {
  history: History;
  isLibrary?: boolean;
  email?: string;
  loginSuccess(): void;
}

const LibraryLoginDesktopPage: React.FC<LoginProps> = (props) => {
  const [libraryCardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [libraryId, setLibrary] = useState(null as null | number);
  const [libraries, setLibraries] = useState([] as RealLibrary[]);
  const [suggestionFailed, setSuggestionFailed] = useState(false);
  const [libraryLabel, setLibraryLabelFailed] = useState("");

  const getLibraries = async () => {
    const loadedLibraries = await getRealLibraries();
    if (loadedLibraries) {
      setLibraries(loadedLibraries);
    }
  }

  useEffect(() => {
    getLibraries();
    /*eslint-disable-next-line*/
  }, []);

  const sendLibraryLogin = async () => {
    if (libraryId) {
      let data = await libraryLogin(libraryId, libraryCardNumber, pin);
      if (!data.isError) {
        if (data === "OK") {
          axios.get(
            `${process.env.REACT_APP_BACKEND_HOST}/user/current`,
            { withCredentials: true }
          ).then(response => {
            const { data } = response;
            if (data.termsAndConditionsAcceptedVersion === null) {
              props.history.push(map.TermsSignUp);
              props.loginSuccess();
            } else {
              props.loginSuccess();
            }
          }).catch(error => {
            // error
            setSuggestionFailed(true);
          });
          return;
        }
        let { msg } = data;
        if (!msg) {
          const { errors } = data;
          msg = errors[0].msg;
        }
        setSuggestionFailed(true);
      } else {
        const { response } = data;
        if (response) {
          if (response.status === 500) {
            setSuggestionFailed(true);
          } else if (response.status === 401) {
            const { msg } = response.data;
            if (msg === "INVALID_EMAIL_OR_PASSWORD") {
              setSuggestionFailed(true);
            }
          }
        } else {
          setSuggestionFailed(true);
        }
      }
    }
  };

  return (
    <div className="left-part library-part-d432">
      <div className="logo">
        <LoginLogo />
      </div>
      <div className="button-box">
        <div className="relative">
          {(libraryId === -1 || libraryId === null) && <div className="absolute-placeholder unselectable" onClick={e => e.preventDefault()}>Library Authority</div>}
          <Select
            className="select-library"
            value={libraryId}
            disabled={false}
            onChange={e => setLibrary(e.target.value as any)}
            MenuProps={{ classes: { paper: 'select-classes-list' } }}
          >
            {libraries.map((s, i) => (
              <MenuItem value={s.id} key={i}>
                <ListItemText>{s.name}</ListItemText>
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="button-box">
        <ProfileInput autoCompleteOff={true} value={libraryCardNumber} validationRequired={false} className="" type="text" onChange={e => setCardNumber(e.target.value)} placeholder="Library Card Barcode" />
      </div>
      <div className="button-box">
        <ProfileInput autoCompleteOff={true} value={pin} validationRequired={false} className="" type="password" onChange={e => setPin(e.target.value)} placeholder="Pin" />
      </div>
      <div className="button-box">
        <button type="submit" className={`sign-in-button ${(pin && libraryCardNumber && libraryId) ? 'green' : ''}`} onClick={sendLibraryLogin}>Sign Up</button>
      </div>
      <LibraryFailedDialog isOpen={suggestionFailed} label={libraryLabel} close={() => {
        setSuggestionFailed(false);
        setLibraryLabelFailed('');
      }} />
    </div>
  );
};

export default connector(LibraryLoginDesktopPage);
