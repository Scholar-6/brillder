import React from 'react';

import { User, UserType } from 'model/user';
import { connect } from 'react-redux';
import { ReduxCombinedState } from 'redux/reducers';

import './UserPreferencePage.scss';
import { Grid, Radio } from '@material-ui/core';

interface UserPreferencePageProps {
    user: User;
}

const UserPreferencePage: React.FC<UserPreferencePageProps> = props => {
    const [preference, setPreference] = React.useState(props.user.rolePreference?.roleId);

    const handleChange = (roleId: UserType) => {
        setPreference(roleId);
    }

    const renderRadioButton = (roleId: UserType) =>
        <Radio
            checked={preference === roleId}
            value={roleId}
        />;

    const RadioContainer: React.FC<{ roleId: UserType, name: string }> = ({ roleId, name, children }) => <>
        <div className="radio-container" onClick={() => handleChange(roleId)}>
            {renderRadioButton(roleId)}
            <span className="radio-text pointer">{name}</span>
        </div>
        <div className="inner-radio-text pointer" onClick={() => handleChange(roleId)}>
            {children}
        </div>
    </>

    return (
        <Grid className="user-preference-page" container direction="column"
            justify="center" alignItems="center"
        >
            <Grid className="user-preference-container" item>
                <h2>Thank you for signing up to Brillder!</h2>
                <p className="user-preference-subtitle">
                    Which of the following best describes you?
                </p>
                <Grid container direction="row">
                    <Grid item>
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
                        <RadioContainer roleId={UserType.Admin} name="Institution">
                            I want to manage classes, students and teachers.<br />
                            <i>Start a 30-day free trial for institutional use.</i>
                        </RadioContainer>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

const mapState = (state: ReduxCombinedState) => ({
    user: state.user.user
});

const connector = connect(mapState);

export default connector(UserPreferencePage);