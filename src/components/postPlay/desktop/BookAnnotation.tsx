import { Grid } from '@material-ui/core';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { Annotation } from 'model/attempt';
import React from 'react';
import { ReduxCombinedState } from 'redux/reducers';
import { connect } from 'react-redux';
import { User } from 'model/user';
import _ from 'lodash';

interface BookAnnotationProps {
  currentUser: User;
  annotation: Annotation;
  updateAnnotation(annotation: Annotation): void;
}

const BookAnnotation: React.FC<BookAnnotationProps> = ({ annotation, ...props }) => {
  const textRef = React.createRef<HTMLElement>();
  const canEdit = React.useMemo(() => props.currentUser.id === annotation.user.id, [props.currentUser, annotation.user]);
  
  const onAnnotationChange = React.useCallback((evt) => {
    if(!textRef.current) return;
    props.updateAnnotation({
      ...annotation,
      text: textRef.current!.innerHTML ?? "",
    });
  }, [textRef.current, annotation]);

  const onAnnotationChangeDebounced = React.useCallback(_.debounce(onAnnotationChange, 500), [onAnnotationChange]);

  return (
    <Grid className={`comment-container comment-${annotation.id}`}>
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
            <span className="bold">Comment: </span>
            <i
              className="comment-text-editable"
              ref={textRef}
              contentEditable={canEdit}
              onInput={onAnnotationChangeDebounced}
              onBlur={onAnnotationChangeDebounced}
              dangerouslySetInnerHTML={{ __html: annotation.text }}
            />
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  currentUser: state.user.user,
});

export default connect(mapState)(React.memo(BookAnnotation, (prevProps, nextProps) => {
  const currentText = document.querySelector(`.comment-${nextProps.annotation.id} .comment-text-editable`)?.innerHTML;
  return nextProps.annotation.text === currentText;
}));