import React, { Component } from 'react';

class FixedHelpers extends Component<any> {
  render() {
    return (
      <div className="fixed-helpers-container">
        <div className="circles">
          <div className="highlight-circle dashed-circle" />
          <div className="share-circle dashed-circle" />
          <div className="assign-circle dashed-circle" />
          <div className="adapt-circle dashed-circle" />
        </div>
        <div className="highlight">
          Highlight Text
        </div>
        <div className="share">
          Share Brick
        </div>
        <div className="assign">
          Assign Brick
        </div>
        <div className="adapt">
          Adapt Brick
        </div>
      </div>
    );
  }
}

export default FixedHelpers;
