import React from "react";
import moment from "moment";
import { IconButton, SvgIcon } from "@material-ui/core";

import { User } from "model/user";
import { Annotation } from "model/attempt";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import _ from "lodash";
import BookAnnotationEditable from "./BookAnnotationEditable";

export interface CommentChildProps {
  annotation: Annotation;
  currentUser: User;
  updateAnnotation(annotation: Annotation): void;
  onDelete(annotationId: number): void;
}

const BookAnnotationReply: React.FC<CommentChildProps> = ({ annotation, ...props }) => {
  let mineComment = false;
  if (annotation.user.id === props.currentUser.id) {
    mineComment = true;
  }

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
    <div className={`comment-child-container comment-${annotation.id}`}>
      <div style={{position: 'absolute'}} className="profile-image-container">
        <div className={`profile-image ${mineComment ? 'yellow-border' : 'red-border'}`}>
          {
            annotation.user?.profileImage
              ? <img alt="profile" src={`${process.env.REACT_APP_BACKEND_HOST}/files/${annotation.user.profileImage}`} />
              : <SpriteIcon name="user" />
          }
        </div>
      </div>
      <div className="comment-head-bar">
        <div className="comment-author bold">
          {annotation.user.firstName} {annotation.user.lastName}
        </div>
        {mineComment && (
          <IconButton
            aria-label="reply"
            size="small"
            color="secondary"
            onClick={() => props.onDelete(annotation.id)}
          >
            <SvgIcon fontSize="inherit">
              <SpriteIcon name="trash-outline" className="active" />
            </SvgIcon>
          </IconButton>
        )}
      </div>
      <div className="comment-date">
        {moment(annotation.timestamp).format("H:mm D MMM")}
      </div>
      <div className="comment-text">
        <span className="bold">Reply: </span>
        <BookAnnotationEditable
          id={annotation.id}
          value={annotation.text}
          ref={textRef}
          canEdit={canEdit}
          onChangeRef={onAnnotationChangeRef}
          focusEditable={() => textRef.current?.focus()}
        />
      </div>
    </div>
  );
};

export default BookAnnotationReply;
