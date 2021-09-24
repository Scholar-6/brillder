import React from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';

import { ReduxCombinedState } from 'redux/reducers';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { User } from 'model/user';

interface BookAnnotationProps {
  user: User;
  textRef: React.MutableRefObject<HTMLElement | undefined>;
}

const BookAnnotationV2: React.FC<BookAnnotationProps> = ({ user, textRef }) => {
  return (
    <Grid className="annotation-container comment-1 focused">
      <div className="comment-item-container">
        <Grid container direction="column">
          <Grid item container direction="row" style={{ position: 'relative', flexWrap: 'nowrap' }}>
            <div style={{ position: 'absolute' }} className="profile-image-container">
              <div className="profile-image">
                {user.profileImage
                  ? <img src={`${process.env.REACT_APP_BACKEND_HOST}/files/${user.profileImage}`} alt="" />
                  : <SpriteIcon name="user" />}
              </div>
            </div>
            <Grid className="stretch" item>
              <h4>{user.firstName} {user.lastName}</h4>
            </Grid>
          </Grid>
          <Grid className="comment-text break-word" onClick={() => textRef.current?.focus()}>
            <span className="bold">Note: </span>
            <i
              className="comment-text-editable"
              placeholder="Type your comment"
              ref={textRef as any}
              contentEditable={true}
              suppressContentEditableWarning={true} // prevent warning for having contenteditable with children
            />
            <i className="placeholder" onClick={() => textRef.current?.focus()}>Type your comment</i>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

export default connect(mapState)(BookAnnotationV2);
