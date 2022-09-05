import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { History } from "history";
import { Snackbar } from "@material-ui/core";
import { ListItemText, MenuItem, Select } from '@material-ui/core';
import axios from "axios";


import TermsLink from "components/baseComponents/TermsLink";
import actions from "redux/actions/auth";
import { login } from "services/axios/auth";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";
import { GetOrigin } from "localStorage/origin";
import DesktopLoginForm from "../desktop/DesktopLoginForm";
import { isPhone } from "services/phone";
import { hideZendesk, showZendesk } from "services/zendesk";
import { ReduxCombinedState } from "redux/reducers";
import { librarySignUp, getRealLibraries, RealLibrary } from "services/axios/realLibrary";
import ProfileInput from "components/userProfilePage/components/ProfileInput";
import LibraryFailedDialog from "components/baseComponents/dialogs/LibraryFailedDialog";
import { UserPreferenceType } from "model/user";

interface MobileLoginProps {
  history: History;
  email?: string;
  referralId?: string;
  isLibrary?: boolean;
  loginSuccess(): void;
}

const MobileRegisterPage: React.FC<MobileLoginProps> = (props) => {
  const [libraryCardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [libraryId, setLibrary] = useState(null as null | number);
  const [libraries, setLibraries] = useState([] as RealLibrary[]);
  const [suggestionFailed, setSuggestionFailed] = useState(false);
  const [libraryLabel, setLibraryLabelFailed] = useState("");
  const [libraryPart, setLibraryPart] = useState(props.isLibrary ? props.isLibrary : false);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertShown, toggleAlertMessage] = useState(false);
  const [passwordHidden, setHidden] = useState(true);
  const [email, setEmail] = useState(props.email || "");
  const [password, setPassword] = useState("");
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

  const validateForm = () => {
    if (email.length > 0 && password.length > 0) {
      return true;
    }
    return "Fill required fields";
  };

  function handleLoginSubmit(event: any) {
    event.preventDefault();

    let res = validateForm();
    if (res !== true) {
      toggleAlertMessage(true);
      setAlertMessage(res);
      return;
    }

    sendLogin(email, password);
  }

  const sendLogin = async (email: string, password: string) => {
    let data = await login(email, password);
    if (!data.isError) {
      if (data === "OK") {
        props.loginSuccess();
        return;
      }
      let { msg } = data;
      if (!msg) {
        const { errors } = data;
        msg = errors[0].msg;
      }
      toggleAlertMessage(true);
      setAlertMessage(msg);
    } else {
      const { response } = data;
      if (response) {
        if (response.status === 500) {
          toggleAlertMessage(true);
          setAlertMessage("Server error");
        } else if (response.status === 401) {
          const { msg } = response.data;
          if (msg === "INVALID_EMAIL_OR_PASSWORD") {
            register(email, password);
          }
        }
      } else {
        register(email, password);
      }
    }
  };

  const register = (email: string, password: string) => {
    let data = {
      email, password, confirmPassword: password, referralId: props.referralId
    } as any;

    var origin = GetOrigin();
    if (origin === 'school') {
      data.userPreference = UserPreferenceType.Student;
    }

    // add library
    if (props.isLibrary) {
      data.userPreference = UserPreferenceType.Student;
      data.library = {
        library: libraryId,
        barcodeNumber: libraryCardNumber,
        pin: pin
      }
    }

    axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/auth/SignUp`, data, { withCredentials: true }
    ).then((resp) => {
      const { data } = resp;

      if (data.errors) {
        toggleAlertMessage(true);
        setAlertMessage(data.errors[0].msg);
        return;
      }

      if (data.msg) {
        toggleAlertMessage(true);
        setAlertMessage(data.msg);
      }

      if (data === "OK") {
        sendLogin(email, password);
      }
    }).catch((e) => {
      toggleAlertMessage(true);
      setAlertMessage("Something may be wrong with the connection.");
    });
  };

  const signUpLibrary = async () => {
    if (pin && libraryCardNumber && libraryId) {
      var res = await librarySignUp(libraryId, libraryCardNumber, pin);
      if (res.success) {
        setLibraryPart(false);
      } else {
        if (res.data === 'User Found') {
          setLibraryLabelFailed(`
          These credentials have already been connected to an account. Please try logging in with your email, or contact us if this doesn't seem right.`);
        } else {
          setLibraryLabelFailed('');
        }
        setSuggestionFailed(true);
      }
    }
  }

  if (libraryPart) {
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
                <button type="submit" className={`sign-in-button ${(pin && libraryCardNumber && libraryId) ? 'green' : ''}`} onClick={signUpLibrary}>Sign Up</button>
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

  return (
    <div className="first-col mobile-register">
      <div className="second-item">
        <div className="logo-box">
          <div>
            <div className="flex-center h-images-container">
              <SpriteIcon name="brain-white-thunder" />
              <div className="brain-container">
                <SpriteIcon name="logo" className="active text-theme-orange" onClick={() => props.history.push(map.Login)} />
                <p className="d-label">Brillder</p>
              </div>
            </div>
            <p className="bold g-big">Join the revolution.</p>
          </div>
        </div>
        <div className="mobile-button-box button-box m-register-box">
          <DesktopLoginForm
            buttonLabel="Sign up"
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            passwordHidden={passwordHidden}
            setHidden={setHidden}
            handleSubmit={handleLoginSubmit}
          />
          {!keyboardShown &&
            <div className="mobile-policy-text">
              <TermsLink history={props.history} />
            </div>}
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={alertShown}
        autoHideDuration={1500}
        onClose={() => toggleAlertMessage(false)}
        message={alertMessage}
        action={<React.Fragment></React.Fragment>}
      />
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

export default connector(MobileRegisterPage);
