import React from "react";
import Grid from "@material-ui/core/Grid";
import { History } from 'history';
import { connect } from 'react-redux';

import './PostPlay.scss';
import { ReduxCombinedState } from "redux/reducers";
import { Brick } from "model/brick";
import { User } from "model/user";
import { setBrillderTitle } from "components/services/titleService";

import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import { BrickFieldNames, PlayButtonStatus } from '../proposal/model';


interface ProposalProps {
  brick: Brick;
  user: User;
  canEdit: boolean;
  history: History;
  playStatus: PlayButtonStatus;
  saveBrick(): void;
  setBrickField(name: BrickFieldNames, value: string): void;
}

interface ProposalState {
  bookHovered: boolean;
}

class PostPlay extends React.Component<ProposalProps, ProposalState> {
  constructor(props: ProposalProps) {
    super(props);
    this.state = {
      bookHovered: false
    }
  }

  openDialog = () => this.setState({  });
  closeDialog = () => this.setState({ });

  onBookHover() { setTimeout(() => this.setState({ bookHovered: true }), 800) }

  render() {
    const { brick } = this.props;

    if (brick.title) {
      setBrillderTitle(brick.title);
    }

    const renderUserRow = () => {
      console.log(this.props.user);
      const { firstName, lastName } = this.props.user;

      return (
        <div className="names-row">
          {firstName ? firstName + ' ' : ''}
          {lastName ? lastName : ''}
        </div>
      );
    }

    let color = "#B0B0AD";
    if (brick.subject) {
      color = brick.subject.color;
    }

    return (
      <div className="post-play-page">
        <HomeButton onClick={() => this.openDialog()} />
        <Grid container direction="row" style={{ height: '100% !important' }} justify="center">
          <Grid className="main-text-container">
            <h1>This book is yours.</h1>
            <h2>Hover your mouse over the cover to see</h2>
            <h2>a summary of your results.</h2>
          </Grid>
          <div className="book-main-container">
            <div className="book-container">
              <div className="book" onMouseOver={() => this.onBookHover()}>
                <div className="back"></div>
                <div className="page6">
                  <div className="normal-page">
                    <div className="normal-page-container">
                    </div>
                  </div>
                </div>
                <div className="page5">
                  <div className="flipped-page">
                  </div>
                </div>
                <div className="page4"></div>
                <div className="page3"></div>
                <div className="page2"></div>
                <div className="page1"></div>
                <div className="front">
                  <div className="page-stitch" style={{background: color}}>
                    <div className="vertical-line"></div>
                    <div className="horizontal-line top-line-1"></div>
                    <div className="horizontal-line top-line-2"></div>
                    <div className="horizontal-line bottom-line-1"></div>
                    <div className="horizontal-line bottom-line-2"></div>
                  </div>
                  <Grid container justify="center" alignContent="center" style={{ height: '100%' }}>
                    <div>
                      <div className="image-background-container">
                      <div className="book-image-container">
                        <img alt="" src="/images/choose-login/logo.png" />
                      </div>
                      </div>
                      <div>{brick.title}</div>
                      {renderUserRow()}
                    </div>
                  </Grid>
                </div>
              </div>
            </div>
            <Grid className="next-button-container" container alignContent="center">
              {
                this.state.bookHovered ? (
                  <div>
                    <div className="next-button" onClick={() => this.props.saveBrick()}></div>
                  </div>
                ) : ""
              }
            </Grid>
          </div>
        </Grid>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const connector = connect(mapState);

export default connector(PostPlay);
