import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { History } from "history";
import { ListItemText, MenuItem, Select } from '@material-ui/core';
import axios from "axios";


import TermsLink from "components/baseComponents/TermsLink";
import actions from "redux/actions/auth";
import { libraryLogin } from "services/axios/auth";
import map from "components/map";
import { isPhone } from "services/phone";
import { hideZendesk, showZendesk } from "services/zendesk";
import { ReduxCombinedState } from "redux/reducers";
import { getRealLibraries, RealLibrary } from "services/axios/realLibrary";
import ProfileInput from "components/userProfilePage/components/ProfileInput";
import LibraryFailedDialog from "components/baseComponents/dialogs/LibraryFailedDialog";

interface MobileLoginProps {
  history: History;
  referralId?: string;
  isLibrary?: boolean;
  loginSuccess(): void;
}

const MobileLibraryLoginPage: React.FC<MobileLoginProps> = (props) => {
  const [libraryCardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [libraryId, setLibrary] = useState(null as null | number);
  const [libraries, setLibraries] = useState([] as RealLibrary[]);
  const [suggestionFailed, setSuggestionFailed] = useState(false);
  const [libraryLabel, setLibraryLabelFailed] = useState("");

  const [keyboardShown, mobileKeyboard] = useState(false);
  const [originalHeight] = useState(window.innerHeight);

  const resizeHandler = () => {
    if (originalHeight > window.innerHeight + 60) {
      hideZendesk();
      mobileKeyboard(true);
    } else {
      mobileKeyboard(false);
      showZendesk();
    }
  }

  const getLibraries = async () => {
    const loadedLibraries = await getRealLibraries();
    if (loadedLibraries) {
      setLibraries(loadedLibraries);
    }
  }

  useEffect(() => {
    getLibraries();

    if (isPhone()) {
      window.addEventListener("resize", resizeHandler);

      return () => {
        window.removeEventListener("resize", resizeHandler);
      }
    }
    /*eslint-disable-next-line*/
  }, []);

  const sendLibraryLogin = async () => {
    if (libraryId) {
      let data = await libraryLogin(libraryId, libraryCardNumber, pin);
      console.log(666, data);
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
            setLibraryLabelFailed('Server error');
          });
          return;
        }
        let { msg } = data;
        if (!msg) {
          const { errors } = data;
          msg = errors[0].msg;
        }
        setSuggestionFailed(true);
        setLibraryLabelFailed(msg);
      } else {
        const { response } = data;
        if (response) {
          if (response.status === 500) {
            setSuggestionFailed(true);
            setLibraryLabelFailed("Server error");
          } else if (response.status === 401) {
            setSuggestionFailed(true);
            setLibraryLabelFailed("Invalid details");
          }
        } else {
          console.log(response);
          setSuggestionFailed(true);
          setLibraryLabelFailed("Invalid details");
        }
      }
    }
  };

  return (
    <div className="first-col mobile-register mobile-register-library">
      <div className="second-item">
        <div className="title">
          Brillder for Libraries
        </div>
        <div className="mobile-button-box button-box m-register-box">
          <div className="mobile-library-box">
            {(libraryId === -1 || libraryId === null) && <div className="absolute-placeholder unselectable" onClick={e => e.preventDefault()}>Library Authority</div>}
            <Select
              className="select-library"
              value={libraryId}
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
          <div className="button-box">
            <ProfileInput autoCompleteOff={true} value={libraryCardNumber} validationRequired={false} className="" type="text" onChange={e => setCardNumber(e.target.value)} placeholder="Library Card Barcode" />
          </div>
          <div className="button-box">
            <ProfileInput autoCompleteOff={true} value={pin} validationRequired={false} className="" type="password" onChange={e => setPin(e.target.value)} placeholder="Pin" />
          </div>
          <div className="input-block library-button-box">
            <div className="button-box">
              <button type="submit" className={`sign-in-button ${(pin && libraryCardNumber && libraryId) ? 'green' : ''}`} onClick={sendLibraryLogin}>Sign In</button>
            </div>
          </div>
          {!keyboardShown &&
            <div className="mobile-policy-text">
              <TermsLink history={props.history} />
            </div>}
        </div>
      </div>
      <LibraryFailedDialog isOpen={suggestionFailed} label={libraryLabel} close={() => {
        setSuggestionFailed(false);
        setLibraryLabelFailed('');
      }} />
    </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  referralId: state.auth.referralId,
})

const mapDispatch = (dispatch: any) => ({
  loginSuccess: () => dispatch(actions.loginSuccess()),
});

const connector = connect(mapState, mapDispatch);

export default connector(MobileLibraryLoginPage);
