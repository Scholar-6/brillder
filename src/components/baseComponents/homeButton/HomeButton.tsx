import React from 'react'
import { Grid } from '@material-ui/core';
import { withRouter } from "react-router-dom";

import './HomeButton.scss';


export interface HomeButtonProps {
  link: string,
  history: any
}

interface HomeButtonState {
  focused: boolean,
  ref: any,

  enterTimeout: any,
  leaveTimeout: any,

  style: any,
}

class HomeButtonComponent extends React.Component<any, HomeButtonState> {
  constructor(props: any) {
    super(props);
    this.state = {
      focused: false,
      ref: React.createRef(),

      enterTimeout: null,
      leaveTimeout: null,

      style: {
        baseSize: '6.3vh',
        animateMarginLeft: '0.9vh',
        animateMarginTop: '2.25vh',
        animateHeight: '4vh',
        animateWidth: '4.5vh',
        transaction: 'all 0.25s ease-in-out',
        delay: 200,
      }
    }
  }

  onMouseEnterHandler() {
    if (this.state.leaveTimeout) {
      clearTimeout(this.state.leaveTimeout);
    }

    const {style} = this.state;
    let homeIcon = this.state.ref.current;
    homeIcon.style.marginTop = style.animateMarginTop;
    homeIcon.style.marginLeft = style.animateMarginLeft;
    homeIcon.style.height = style.animateHeight;
    homeIcon.style.width = style.animateWidth;
    homeIcon.style.transition = style.transaction;

    const enterTimeout = setTimeout(() => {
      homeIcon.style.transition = 'none';
      homeIcon.style.marginTop = 0;
      homeIcon.style.marginLeft = 0;
      homeIcon.style.height = style.baseSize;
      homeIcon.style.width = style.baseSize;
      homeIcon.style.backgroundImage = 'url(/images/brick-list/home-hover.png)';
      this.setState({...this.state, enterTimeout: null});
    }, style.delay);
    this.setState({...this.state, enterTimeout})
  }

  onMouseLeaveHandler() {
    if (this.state.enterTimeout) {
      clearTimeout(this.state.enterTimeout);
    }
    const {style} = this.state;
    let homeIcon = this.state.ref.current;
    homeIcon.style.marginTop = 0;
    homeIcon.style.marginLeft = 0;
    homeIcon.style.marginTop = style.animateMarginTop;
    homeIcon.style.marginLeft = style.animateMarginLeft;
    homeIcon.style.height = style.animateHeight;
    homeIcon.style.width = style.animateWidth;
    homeIcon.style.backgroundImage = 'url(/images/choose-login/logo.png)';

    const leaveTimeout = setTimeout(() => {
      homeIcon.style.transition = 'none';
      homeIcon.style.height = style.baseSize;
      homeIcon.style.width = style.baseSize;
      homeIcon.style.marginTop = 0;
      homeIcon.style.marginLeft = 0;
      homeIcon.style.transition = style.transaction;
      this.setState({...this.state, leaveTimeout: null});
    }, 100);
    this.setState({...this.state, leaveTimeout})
  }

  render() {
    return (
      <Grid item style={{width: '7.65vw'}}>
        <Grid container direction="row">
          <Grid item className="home-button-container">
            <div
              className="home-button"
              onMouseEnter={() => this.onMouseEnterHandler()}
              onMouseLeave={() => this.onMouseLeaveHandler()}
              onClick={() => { this.props.history.push(this.props.link) }}
            >
              <div ref={this.state.ref} />
            </div>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(HomeButtonComponent);
