import React from 'react';

import { User, UserType } from 'model/user';
import { connect } from 'react-redux';
import { ReduxCombinedState } from 'redux/reducers';
import userActions from 'redux/actions/user';

import './UserPreferencePage.scss';
import { Grid, Radio } from '@material-ui/core';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { checkAdmin } from 'components/services/brickService';

interface UserPreferencePageProps {
  user: User;
  getUser(): void;
}

const UserPreferencePage: React.FC<UserPreferencePageProps> = props => {
  const isAdmin = checkAdmin(props.user.roles);
  const [preference, setPreference] = React.useState(props.user.rolePreference?.roleId);
  const history = useHistory();

  const handleChange = (roleId: UserType, disabled: boolean) => {
    if (disabled) {
      return;
    }
    setPreference(roleId);
    axios.put(
      `${process.env.REACT_APP_BACKEND_HOST}/user/rolePreference/${roleId}`, {}, { withCredentials: true }
    ).then(() => {
      props.getUser();
    }).catch((e) => {
      console.log(e);
    });
  }

  const renderRadioButton = (roleId: UserType) => {
    return <Radio checked={preference === roleId} value={roleId} />;
  }

  const moveNext = () => {
    if (preference && props.user.rolePreference) {
      history.push("/terms");
    }
  }

  const RadioContainer: React.FC<{ roleId: UserType, name: string }> = ({ roleId, name, children }) => {
    let disabled = false;
    if (!isAdmin && roleId === UserType.Institution) {
      disabled = true;
    }

    let className = 'radio-container';
    if (disabled) {
      className += ' disabled';
    }

    return (
      <div>
        <div className={className} onClick={() => handleChange(roleId, disabled)}>
          {renderRadioButton(roleId)}
          <span className="radio-text pointer">{name}</span>
        </div>
        <div className="inner-radio-text pointer" onClick={() => handleChange(roleId, disabled)}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <Grid className="user-preference-page" container direction="column"
      justify="center" alignItems="center"
    >
      <Grid className="user-preference-container" item>
        <h2>Thank you for signing up to Brillder!</h2>
        <p className="user-preference-subtitle">
          Which of the following best describes you?
        </p>
        <RadioContainer roleId={UserType.Student} name="Student">
          I want to play brick content, receive assignments and feedback, or join a course.
        </RadioContainer>
        <RadioContainer roleId={UserType.Builder} name="Builder">
          I want to build and submit brick content for paid publication.
        </RadioContainer>
        <RadioContainer roleId={UserType.Teacher} name="Teacher / Tutor">
          I want to assign brick content, and provide feedback to my students.<br />
          <i>Use my institution's license or start a 30-day free trial for personal use.</i>
        </RadioContainer>
        <RadioContainer roleId={UserType.Institution} name="Institution">
          I want to manage classes, students and teachers.<br />
          <i>Start a 30-day free trial for institutional use.</i>
        </RadioContainer>
        <button
          type="button"
          className={`user-preference-next svgOnHover ${preference ? "play-green animated pulse-green duration-1s" : "play-gray disabled"}`}
          onClick={moveNext}
        >
          <SpriteIcon name="arrow-right" className="w80 h80 active m-l-02" />
        </button>
      </Grid>
    </Grid>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user
});

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser())
});

const connector = connect(mapState, mapDispatch);

export default connector(UserPreferencePage);
