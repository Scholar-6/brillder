import React from 'react';
import { Grid, Radio } from '@material-ui/core';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './UserPreferencePage.scss';
import { ReduxCombinedState } from 'redux/reducers';
import userActions from 'redux/actions/user';
import map from 'components/map';
import { User, UserPreferenceEnum, UserType } from 'model/user';
import { checkAdmin } from 'components/services/brickService';
import { setUserPreference } from 'services/axios/user';

import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface UserPreferencePageProps {
  user: User;
  getUser(): void;
}

const UserPreferencePage: React.FC<UserPreferencePageProps> = props => {
  const isAdmin = checkAdmin(props.user.roles);
  const [preference, setPreference] = React.useState(props.user.userPreference?.preferenceId);
  const history = useHistory();

  const handleChange = async (roleId: UserPreferenceEnum, disabled: boolean) => {
    if (disabled) {
      return;
    }
    setPreference(roleId);
    try {
      await setUserPreference(roleId);
      props.getUser();
    } catch (e) {
      console.log(e);
    }
  }

  const renderRadioButton = (preferenceId: UserPreferenceEnum) => {
    return <Radio checked={preference === preferenceId} value={preferenceId} />;
  }

  const moveNext = () => {
    if (preference && props.user.userPreference) {
      history.push(map.TermsPage);
    }
  }

  const RadioContainer: React.FC<{ roleId: UserPreferenceEnum | UserType, name: string }> = ({ roleId, name, children }) => {
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
        <div className={className} onClick={() => handleChange(roleId as UserPreferenceEnum, disabled)}>
          {renderRadioButton(roleId as UserPreferenceEnum)}
          <span className="radio-text pointer">{name}</span>
        </div>
        <div className="inner-radio-text pointer" onClick={() => handleChange(roleId as UserPreferenceEnum, disabled)}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <Grid
      className="user-preference-page"
      container direction="column"
      justify="center" alignItems="center"
    >
      <Grid className="user-preference-container" item>
        <h2>Thank you for signing up to Brillder!</h2>
        <p className="user-preference-subtitle">
          Which of the following best describes you?
        </p>
        <RadioContainer roleId={UserPreferenceEnum.Student} name="Student">
          I want to play brick content, receive assignments and feedback, or join a course.
        </RadioContainer>
        <RadioContainer roleId={UserPreferenceEnum.Builder} name="Builder">
          I want to build and submit brick content for paid publication.
        </RadioContainer>
        <RadioContainer roleId={UserPreferenceEnum.Teacher} name="Teacher / Tutor">
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
