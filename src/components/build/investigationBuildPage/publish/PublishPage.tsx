import React, { Component } from "react";
// @ts-ignore
import { Grid, CircularProgress } from "@material-ui/core";

import "./PublishPage.scss";

interface PublishBrickProps {
  history: any;
  forgetBrick(): void;
  logout(): void;
}

enum ButtonStatus {
  Start,
  Pressed,
  Wider
}

interface PublishBrickState {
  status: ButtonStatus;
  progress: number;
  myRef: any;
}

class PublishBrickPage extends Component<PublishBrickProps, PublishBrickState> {
  constructor(props: PublishBrickProps) {
    super(props);

    this.state = {
      status: ButtonStatus.Start,
      myRef: React.createRef(),
      progress: 0
    };
  }

  animate(e: any) {
    let target = e.currentTarget;
    target.style.width = "7vw";
    target.style.background = "white";
    target.style.color = "#3FCA79";
    target.borderRadius = "20vw";
    e.target.style.fontSize = "3vw";
    e.target.innerHTML = "✔";
    setTimeout(() => {
      this.setState({ ...this.state, status: ButtonStatus.Pressed });
      let counter = setInterval(() => {
        if (this.state.progress < 100) {
          this.setState({ ...this.state, progress: this.state.progress + 4 });
        } else {
          clearInterval(counter);
          this.setState({ ...this.state, status: ButtonStatus.Wider });
        }
      }, 40);
    }, 400);
  }

  componentDidUpdate() {
    if (this.state.status === ButtonStatus.Wider) {
      let button = this.state.myRef.current;
      console.log(button);
      setTimeout(() => {
        button.style.width = '20vw';
      }, 200);
    }
  }

  render() {
    const { status } = this.state;
    return (
      <Grid
        container
        direction="row"
        className="publish-brick-page"
        justify="center"
        alignContent="center"
      >
        {status === ButtonStatus.Start ? (
          <button
            className="publish-brick-button"
            onClick={e => this.animate(e)}
          >
            <Grid
              container
              direction="row"
              justify="center"
              alignContent="center"
            >
              Submit/Publish
            </Grid>
          </button>
        ) : (
          ""
        )}
        {status === ButtonStatus.Pressed ? (
          <div className="brick-spinner">
            <CircularProgress
              variant="static"
              value={100}
              color="secondary"
              className="spinner spinner-background"
            />
            <CircularProgress
              variant="determinate"
              value={this.state.progress}
              color="secondary"
              className="spinner front-spinner"
            />
          </div>
        ) : (
          ""
        )}
        {status === ButtonStatus.Wider ? (
          <button
            className="publish-brick-button"
            ref={this.state.myRef}
            style={{width: '7vw'}}
            onClick={e => this.animate(e)}
          >
            <Grid
              container
              direction="row"
              justify="center"
              alignContent="center"
            >
              ✔
            </Grid>
          </button>
        ) : (
          ""
        )}
      </Grid>
    );
  }
}

export default PublishBrickPage;
