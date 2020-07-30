import React, { Component } from "react";
import Avatar from '@material-ui/core/Avatar';

import './VerticalShufflePreview.scss';
import { Grid } from "@material-ui/core";


class VerticalShufflePreview extends Component<any, any> {
  constructor(props: any) {
    super(props);

    const height = 10.5;

    this.state = {
      height,
      buttons: [
        {
          top: 0,
          correctIndex: 1,
          text: 'Alexander’s last lesson with Aristotle'
        },
        {
          top: height,
          correctIndex: 2,
          text: 'Philip II of Macedon assassinated'
        },
        {
          top: height * 2,
          correctIndex: 0,
          text: 'Trial of Socrates'
        }
      ]
    }
  }

  renderButton(btnContent: any, i: number) {
    let className = "";
    console.log(i)
    if (i === btnContent.correctIndex) {
      className = "correct";
    }
    return (
      <button className={className} style={{ position: 'absolute', top: `${btnContent.top}vh` }} key={i}>
        <div>
          <Grid container justify="center" alignContent="center" className="circle-number">
            <Avatar>{btnContent.correctIndex + 1}</Avatar>
          </Grid>
        </div>
        {btnContent.text}
      </button>
    );
  }

  componentDidMount() {
    setTimeout(() => {
      let firstDone = false;
      let secondDone = false;
      let thirdDone = false;

      let { buttons } = this.state;
      /*
      let temp = buttons[0];
      let temp2 = buttons[1];
      let temp3 = buttons[2];
      buttons[0] = temp3;
      buttons[1] = temp;
      buttons[2] = temp2;
      */
      this.setState({ buttons });
      this.render();
      let step = 0.8;
      const interval = setInterval(() => {
        if (buttons[0].top !== this.state.height) {
          buttons[0].top += step;
          if (buttons[0].top >= this.state.height - step) {
            buttons[0].top = this.state.height;
            firstDone = true;
          }
        }
        if (buttons[1].top !== this.state.height * 2) {
          buttons[1].top += step;
          if (buttons[1].top >= (this.state.height * 2) - step) {
            buttons[1].top = this.state.height * 2;
            secondDone = true;
          }
        }
        if (buttons[2].top !== 0) {
          buttons[2].top -= step * 2;
          if (buttons[2].top <= (step * 2)) {
            buttons[2].top = 0;
            thirdDone = true;
          }
        }

        if (firstDone && secondDone && thirdDone) {
          let temp = buttons[0];
          let temp2 = buttons[1];
          let temp3 = buttons[2];
          buttons[0] = temp3;
          buttons[1] = temp;
          buttons[2] = temp2;
          clearInterval(interval);
        }

        this.setState({ buttons });
      }, 50);
    }, 200);
  }

  render() {
    return (
      <div className="phone-preview-component vertical-shuffle-preview">
        <Grid container justify="center" className="small-text">
          Place the following events
          in chronological order
        </Grid>
        <div style={{ position: 'relative' }}>
          {this.state.buttons.map((btnContent: any, i: number) => this.renderButton(btnContent, i))}
        </div>
      </div>
    )
  }
}

export default VerticalShufflePreview;
