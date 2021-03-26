import { checkAdmin, checkTeacher } from 'components/services/brickService';
import { User } from 'model/user';
import React, { Component } from 'react';

interface Props {
  user: User;
}

class FixedHelpers extends Component<Props> {
  render() {
    const canSee = checkTeacher(this.props.user) || checkAdmin(this.props.user.roles);
    return (
      <div className="fixed-helpers-container">
        <div className="circles">
          <div className="highlight-circle dashed-circle" />
          <div className="share-circle dashed-circle" />
          {canSee && <div className="assign-circle dashed-circle" />}
          {canSee && <div className="adapt-circle dashed-circle" />}
        </div>
        <div className="highlight">
          Highlight Text
        </div>
        <div className="share">
          Share Brick
        </div>
        {canSee &&
        <div className="assign">
          Assign Brick
        </div>}
        {canSee &&
        <div className="adapt">
          Adapt Brick
        </div>}
      </div>
    );
  }
}

export default FixedHelpers;
