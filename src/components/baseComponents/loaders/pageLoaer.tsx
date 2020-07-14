import React from 'react'
import { withRouter } from "react-router-dom";

import './pageLoaer.scss';

class HomeButtonComponent extends React.Component<any, HomeButtonState> {
  render() {
    return (
      <div className="page-loader">
        <img src="/assets/img/dot-loader.svg" alt=""/>
        <span>content</span>
      </div>

    );
  }
}