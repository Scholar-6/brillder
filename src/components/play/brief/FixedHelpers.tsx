import { checkAdmin, checkTeacher } from 'components/services/brickService';
import { User } from 'model/user';
import React, { Component } from 'react';

interface Props {
  user: User;
}

class FixedHelpers extends Component<Props> {
  renderBorder(className: string) {
    return <img alt="circle-border" className={className + " dashed-circle"} src="/images/borders/small-dash-circle.svg" />;
  }

  render() {
    const canSee = checkTeacher(this.props.user) || checkAdmin(this.props.user.roles);
    return (
      <div className="fixed-helpers-container">
        <div className="circles">
          {this.renderBorder('highlight-circle')}
          {this.renderBorder('share-circle')}
          {canSee && this.renderBorder('assign-circle')}
          {canSee && this.renderBorder('adapt-circle')}
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
          </div>
        }
        {canSee &&
          <div className="adapt">
            Adapt Brick
          </div>
        }
      </div>
    );
  }
}

export default FixedHelpers;
