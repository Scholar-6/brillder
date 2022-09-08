import React, { useEffect, useState } from "react";
import { Snackbar } from "@material-ui/core";
import { connect } from "react-redux";
import { History } from "history";
import axios from "axios";
import { ListItemText, MenuItem, Select } from '@material-ui/core';

import actions from "redux/actions/auth";
import { login } from "services/axios/auth";
import LoginLogo from '../components/LoginLogo';
import WrongLoginDialog from "../components/WrongLoginDialog";
import DesktopLoginForm from "./DesktopLoginForm";
import map from "components/map";
import { ReduxCombinedState } from "redux/reducers";
import { GetOrigin } from "localStorage/origin";
import { UserPreferenceType } from "model/user";
import { checkLibraryAccount, getRealLibraries, RealLibrary } from "services/axios/realLibrary";
import ProfileInput from "components/userProfilePage/components/ProfileInput";
import LibraryFailedDialog from "components/baseComponents/dialogs/LibraryFailedDialog";
import HowEmailUsedPopup from "./HowEmailUsedPopup";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import TextDialog from "components/baseComponents/dialogs/TextDialog";

const mapState = (state: ReduxCombinedState) => ({
  referralId: state.auth.referralId,
})

const mapDispatch = (dispatch: any) => ({
  loginSuccess: () => dispatch(actions.loginSuccess()),
});

const connector = connect(mapState, mapDispatch);

interface LoginProps {
  history: History;
  isLibrary?: boolean;
  email?: string;
  referralId?: string;
  loginSuccess(): void;
}

const EmailRegisterDesktopPage: React.FC<LoginProps> = (props) => {
  const [libraryCardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [libraryId, setLibrary] = useState(null as null | number);
  const [libraries, setLibraries] = useState([] as RealLibrary[]);
  const [suggestionFailed, setSuggestionFailed] = useState(false);
  const [libraryLabel, setLibraryLabelFailed] = useState("");
  const [verifyingLibrary, setVerifyingLibrary] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertShown, toggleAlertMessage] = useState(false);
  const [passwordHidden, setHidden] = useState(true);
  const [email, setEmail] = useState(props.email || "");
  const [password, setPassword] = useState("");
  const [isLoginWrong, setLoginWrong] = useState(false);

  const [libraryConnected, setLibraryConnected] = useState(false);
  const [libraryPart, setLibraryPart] = useState(props.isLibrary ? props.isLibrary : false);

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

  const getLibraries = async () => {
    const loadedLibraries = await getRealLibraries();
    if (loadedLibraries) {
      setLibraries(loadedLibraries);
    }
  }

  useEffect(() => {
    if (props.isLibrary) {
      getLibraries();
    }
    /*eslint-disable-next-line*/
  }, []);

  const sendLogin = async (email: string, password: string) => {
    let data = await login(email, password);
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
          toggleAlertMessage(true);
          setAlertMessage("Server error");
        });
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

      if (data.msg === "INVALID_EMAIL_OR_PASSWORD") {
        setLoginWrong(true);
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
      setAlertMessage("An account with this email address already exists. Please return to the homepage and use the Login button, or use click Help to send us a message.");
    });
  };

  const verifyLibrary = async () => {
    if (pin && libraryCardNumber && libraryId) {
      setVerifyingLibrary(true);
      var res = await checkLibraryAccount(libraryId, libraryCardNumber, pin);
      setVerifyingLibrary(false);
      if (res.success) {
        setLibraryConnected(true);
        setLibraryPart(false);
      } else {
        setSuggestionFailed(true);
        if (res.data === 'Error occurred while checking library details') {
          setLibraryLabelFailed(`We were unable to verify your details. Please check you have entered the correct information, or contact us if this doesn't seem right.`);
        } else if (res.data === 'User Found') {
          setLibraryLabelFailed(`These credentials have already been connected to an account. Please try logging in with your email, or contact us if this doesn't seem right.`);
        } else {
          setLibraryLabelFailed('');
        }
      }
    }
  }

  if (libraryPart) {
    return (
      <div className="left-part right library-part-d432">
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
        <div className="button-box button-spinning">
          <button type="submit" className={`sign-in-button ${(pin && libraryCardNumber && libraryId) ? 'green' : ''}`} onClick={verifyLibrary}>
            {verifyingLibrary && <SpriteIcon className="spinning" name="f-loader" />}
            <span>Link Library</span>
          </button>
        </div>
        <LibraryFailedDialog isOpen={suggestionFailed} label={libraryLabel} close={() => {
          setSuggestionFailed(false);
          setLibraryLabelFailed('');
        }} />
      </div>
    );
  }

  return (
    <div className="left-part right register-part">
      <div className="logo">
        <LoginLogo />
      </div>
      {props.isLibrary &&
      <div className="text-white library-e-r-label">
        <div>Thank you, your credentials have been verified. As a new user, please register an email and password to your account.</div>
      </div>}
      <div className="button-box">
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
      </div>
      {props.isLibrary && <HowEmailUsedPopup />}
      <WrongLoginDialog isOpen={isLoginWrong} submit={() => register(email, password)} close={() => setLoginWrong(false)} />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={alertShown}
        autoHideDuration={1500}
        onClose={() => toggleAlertMessage(false)}
        message={alertMessage}
        action={<React.Fragment></React.Fragment>}
      />
      <TextDialog isOpen={libraryConnected} label="Great your library barcode and pin is valid, please also provide an email and password" close={() => setLibraryConnected(false)} />
    </div>
  );
};

export default connector(EmailRegisterDesktopPage);
