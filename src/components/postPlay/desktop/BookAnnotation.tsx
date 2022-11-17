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
import BookAnnotationEditable from './BookAnnotationEditable';
import ReplyCommentPanel from 'components/baseComponents/comments/ReplyCommentPanel';
import { Brick } from 'model/brick';

interface BookAnnotationProps {
  currentUser: User;
  annotation: Annotation;
  updateAnnotation(annotation: Annotation): void;
  deleteAnnotation?(): void;
  addAnnotationReply?(text: string): void;
  updateAnnotationReply?(reply: Annotation): void;
  deleteAnnotationReply?(replyId: number): void;
  disableFocus?: boolean;
}


const BookAnnotation: React.FC<BookAnnotationProps> = ({ annotation, ...props }) => {
  const history = useHistory();
  const [addingReply, setAddingReply] = React.useState(false);
  const focused = React.useMemo(() => props.disableFocus ? false : (history.location.hash.substr(1) === annotation.id.toString()), [props.disableFocus, history.location, annotation]);

  const textRef = React.useRef<HTMLElement>();
  const canEdit = React.useMemo(() => props.currentUser.id === annotation.user.id, [props.currentUser, annotation.user]);

  const onAnnotationChange = React.useCallback(() => {
    if (!textRef.current) return;
    props.updateAnnotation({
      ...annotation,
      text: textRef.current!.innerText ?? "",
    });
    /*eslint-disable-next-line*/
  }, [annotation, props.updateAnnotation]);

  const onAnnotationChangeRef = React.useRef<(() => void) & _.Cancelable>();
  React.useEffect(() => {
    if (onAnnotationChangeRef.current) {
      onAnnotationChangeRef.current.cancel();
    }
    onAnnotationChangeRef.current = _.throttle(onAnnotationChange, 500, { leading: true, trailing: true });
  }, [onAnnotationChange]);

  return (
    <Grid
      className={`annotation-container comment-${annotation.id} ${focused ? "focused" : ""}`}
      onMouseDown={props.disableFocus ? (() => { }) : (() => history.push("#" + annotation.id))}
    >
      <div className="comment-item-container">
        <Grid container direction="column">
          <Grid item container direction="row" style={{ position: 'relative', flexWrap: 'nowrap' }}>
            <div style={{ position: 'absolute' }} className="profile-image-container">
              <div className="profile-image">
                {annotation.user.profileImage
                  ? <img src={`${process.env.REACT_APP_AWS_S3_IMAGES_BUCKET_NAME}/files/${annotation.user.profileImage}`} alt="" />
                  : <SpriteIcon name="user" />}
              </div>
            </div>
            <Grid className="stretch" item>
              <h4>{annotation.user.firstName} {annotation.user.lastName}</h4>
            </Grid>
            <div className="buttons-container">
              {canEdit && (
                <SpriteIcon name="corner-up-left" className="reply-icon-g2" onClick={() => setAddingReply(true)} />
              )}
              {props.deleteAnnotation && canEdit && (
                <button
                  aria-label="delete"
                  className="cancel-button svgOnHover"
                  onClick={props.deleteAnnotation}
                >
                  <SpriteIcon name="trash-outline" className="active" />
                </button>
              )}
            </div>
          </Grid>
          <Grid className="comment-text break-word" onClick={() => textRef.current?.focus()}>
            <span className="bold">Note: </span>
            <BookAnnotationEditable
              id={annotation.id}
              value={annotation.text}
              ref={textRef}
              canEdit={canEdit}
              onChangeRef={onAnnotationChangeRef}
              focusEditable={() => textRef.current?.focus()}
            />
          </Grid>
          {props.addAnnotationReply && <Collapse in={focused}>
            <div className="comment-reply-container">
              {annotation.children?.map(child => (
                <BookAnnotationReply
                  key={child.id}
                  annotation={child}
                  currentUser={props.currentUser}
                  onDelete={props.deleteAnnotationReply!}
                  updateAnnotation={props.updateAnnotationReply!}
                />
              ))}
            </div>
            {addingReply && <ReplyCommentPanel
              parentComment={{ id: -1, location: '' } as any}
              currentBrick={{ id: -1 } as Brick}
              collapsePanel={() => setAddingReply(false)}
              createComment={comment => props.addAnnotationReply?.(comment.text)}
            />}
          </Collapse>}
          {props.addAnnotationReply && annotation.children && annotation.children.length > 0 && <Collapse in={!focused}>
            <div className="add-reply inactive">
              <div className="grey-circle">
                <div className="grey-background" />
                <SpriteIcon name="plus" className="reply-icon" />
              </div>
              <span>{annotation.children?.length ?? 0} {annotation.children?.length === 1 ? "Reply" : "Replies"}</span>
            </div>
          </Collapse>}
        </Grid>
      </div>
    </Grid>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  currentUser: state.user.user,
});

export default connect(mapState)(BookAnnotation);