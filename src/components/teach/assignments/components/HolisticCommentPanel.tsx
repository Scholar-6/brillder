import { Popover } from '@material-ui/core';
import axios from 'axios';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { generateId } from 'components/build/buildQuestions/questionTypes/service/questionBuild';
import BookAnnotationV2 from 'components/postPlay/desktop/BookAnnotationV2';
import { Annotation, AnnotationLocation } from 'model/attempt';
import { AttemptStats } from 'model/stats';
import { User } from 'model/user';
import React from 'react';
import { connect } from 'react-redux';
import { ReduxCombinedState } from 'redux/reducers';

interface HolisticCommentPanelProps {
  currentUser: User;
  currentAttempt?: AttemptStats;
  setCurrentAttempt(attempt: AttemptStats): void;
  onClose(): void;
  anchorEl?: Element;
}

const HolisticCommentPanel: React.FC<HolisticCommentPanelProps> = props => {
  const textRef = React.useRef<HTMLElement>();

  const createHolisticComment = React.useCallback(() => {
    if (!props.currentAttempt) return;
    if (!textRef.current) return;

    const text = textRef.current.innerText;
    if (!text || text.length < 0) return;

    const newAttempt = props.currentAttempt;
    const newAnnotation: Annotation = {
      id: generateId(),
      location: AnnotationLocation.Brief,
      priority: 1,
      text,
      timestamp: new Date(),
      user: props.currentUser,
      children: [],
    };
    newAttempt.annotations = [...(newAttempt.annotations ?? []), newAnnotation];

    props.setCurrentAttempt(newAttempt);
    saveAttempt(newAttempt);
    props.onClose();
    /*eslint-disable-next-line*/
  }, [props.currentAttempt]);

  const saveAttempt = React.useCallback(async (attempt: AttemptStats) => {
    const newAttempt = Object.assign({}, attempt);

    newAttempt.answers = attempt.answers.map(answer => ({ ...answer, answer: JSON.parse(JSON.parse(answer.answer)) }));
    newAttempt.liveAnswers = attempt.liveAnswers.map(answer => ({ ...answer, answer: JSON.parse(JSON.parse(answer.answer)) }));

    return await axios.put(
      process.env.REACT_APP_BACKEND_HOST + "/play/attempt",
      { id: attempt.id, userId: props.currentUser.id, body: newAttempt },
      { withCredentials: true }
    ).catch(e => {
      if (e.response.status !== 409) {
        throw e;
      }
    });
    /*eslint-disable-next-line*/
  }, []);

  return (
    <Popover
      open={!!props.anchorEl}
      onClose={props.onClose}
      anchorEl={props.anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      className="holistic-comment-popup"
    >
      <div className="holistic-comment-panel">
        <BookAnnotationV2 textRef={textRef} />
        <div className="centered" onClick={createHolisticComment}>
          <div className={`save-button b-green`}>
            <SpriteIcon name="send" className="active" />
          </div>
        </div>
      </div>
    </Popover>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  currentUser: state.user.user,
});

export default connect(mapState)(HolisticCommentPanel);