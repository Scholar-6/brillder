import React, { Component } from "react";
import Avatar from '@material-ui/core/Avatar';
import { ReactSortable } from 'react-sortablejs';

import './VerticalShufflePreview.scss';
import { Grid } from "@material-ui/core";


class VerticalShufflePreview extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      buttons: [
        {
          correctIndex: 1,
          text: 'Alexander’s last lesson with Aristotle'
        },
        {
          correctIndex: 2,
          text: 'Philip II of Macedon assassinated'
        },
        {
          correctIndex: 0,
          text: 'Trial of Socrates'
        }
      ]
    }
  }

  renderButton(btnContent: any, i: number) {
    let className = "";
    if (i === btnContent.correctIndex) {
      className = "correct";
    }
    return (
      <button className={className} key={i}>
        <div>
          <Grid container justify="center" alignContent="center" className="circle-number">
            <Avatar>{btnContent.correctIndex + 1}</Avatar>
          </Grid>
        </div>
        {btnContent.text}
      </button>
    );
  }

  setButtons(buttons: any[]) {
    this.setState({...this.state, buttons});
  }

  render() {
    return (
      <div className="phone-preview-component vertical-shuffle-preview">
        <Grid container justify="center" className="small-text">
          Place the following events
          in chronological order
        </Grid>
        <ReactSortable
          list={this.state.buttons}
          animation={150}
          setList={(btns:any) => this.setButtons(btns)}>
          {
            this.state.buttons.map((btnContent: any, i: number) => this.renderButton(btnContent, i))
          }
        </ReactSortable>
      </div>
    )
  }
}

export default VerticalShufflePreview;
