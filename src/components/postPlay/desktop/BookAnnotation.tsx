import { Collapse, Grid } from '@material-ui/core';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { Annotation } from 'model/attempt';
import React from 'react';
import { ReduxCombinedState } from 'redux/reducers';
import { connect } from 'react-redux';
import { User } from 'model/user';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import BookAnnotationReply from './BookAnnotationReply';
import { generateId } from 'components/build/buildQuestions/questionTypes/service/questionBuild';
import BookAnnotationEditable from './BookAnnotationEditable';

interface BookAnnotationProps {
  currentUser: User;
  annotation: Annotation;
  updateAnnotation(annotation: Annotation): void;
  addAnnotationReply(): void;
  updateAnnotationReply(reply: Annotation): void;
  deleteAnnotationReply(replyId: number): void;
}


const BookAnnotation: React.FC<BookAnnotationProps> = ({ annotation, ...props }) => {
  const history = useHistory();
  const focused = React.useMemo(() => history.location.hash.substr(1) === annotation.id.toString(), [history.location, annotation]);

  const textRef = React.useRef<HTMLElement>();
  const canEdit = React.useMemo(() => props.currentUser.id === annotation.user.id, [props.currentUser, annotation.user]);

  const onAnnotationChange = React.useCallback(() => {
    if(!textRef.current) return;
    props.updateAnnotation({
      ...annotation,
      text: textRef.current!.innerHTML ?? "",
    });
  }, [annotation, props.updateAnnotation]);

  const onAnnotationChangeRef = React.useRef<(() => void) & _.Cancelable>();
  React.useEffect(() => {
    if(onAnnotationChangeRef.current) {
      onAnnotationChangeRef.current.cancel();
    }
    onAnnotationChangeRef.current = _.debounce(onAnnotationChange, 500);
  }, [onAnnotationChange]);

  return (
    <Grid
      className={`comment-container comment-${annotation.id} ${focused ? "focused" : ""}`}
      onMouseDown={() => history.push("#" + annotation.id)}
    >
      <div className="comment-item-container">
        <Grid container direction="column">
          <Grid item container direction="row" style={{ position: 'relative', flexWrap: 'nowrap' }}>
            <div style={{ position: 'absolute' }} className="profile-image-container">
              <div className="profile-image">
                {annotation.user.profileImage
                  ? <img src={`${process.env.REACT_APP_BACKEND_HOST}/files/${annotation.user.profileImage}`} alt="" />
                  : <SpriteIcon name="user" />}
              </div>
            </div>
            <Grid className="stretch" item>
              <h4>{annotation.user.firstName} {annotation.user.lastName}</h4>
            </Grid>
          </Grid>
          <Grid className="comment-text break-word">
            <span className="bold">Note: </span>
            <BookAnnotationEditable
              id={annotation.id}
              value={annotation.text}
              ref={textRef}
              canEdit={canEdit}
              onChangeRef={onAnnotationChangeRef}
            />
          </Grid>
          <Collapse in={focused}>
            <div className="comment-reply-container">
              {annotation.children?.map(child => (
                <BookAnnotationReply
                  key={child.id}
                  annotation={child}
                  currentUser={props.currentUser}
                  onDelete={props.deleteAnnotationReply}
                  updateAnnotation={props.updateAnnotationReply}
                />
              ))}
            </div>
            <div className="add-reply" onClick={props.addAnnotationReply}>
              <div className="grey-circle">
                <SpriteIcon name="corner-up-left" className="reply-icon" />
              </div>
              <span>Reply</span>
            </div>
          </Collapse>
          <Collapse in={!focused}>
            <div className="add-reply inactive">
              <div className="grey-circle">
                <SpriteIcon name="plus" className="reply-icon" />
              </div>
              <span>{annotation.children?.length ?? 0} {annotation.children?.length === 1 ? "Reply" : "Replies"}</span>
            </div>
          </Collapse>
        </Grid>
      </div>
    </Grid>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  currentUser: state.user.user,
});

export default connect(mapState)(BookAnnotation);