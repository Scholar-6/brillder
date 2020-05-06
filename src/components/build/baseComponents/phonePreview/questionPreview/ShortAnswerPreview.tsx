import React, { useEffect, useState, Component } from "react";

import './ShortAnswerPreview.scss';
import { Grid } from "@material-ui/core";


class ShortAnswerPreview extends Component<any, any> {
  constructor(props: any) {
    super(props);

    let text = 'Oscar Wilde'

    let count = 0;
    this.state = { text: '' }

    let interval = setInterval(() => {
      this.setState({...this.state, text: this.state.text + text[count]});
      if (count > 9) {
        clearInterval(interval);
      }
      count++;
    }, 150);
  }

  render() {
    return (
      <div className="phone-preview-component short-answer-preview">
        <Grid container justify="center" className="small-text">
          'All art is quite useless' is a quote from an 1890 novel by which author?
        </Grid>
        <Grid container justify="center" className="big-animated-text">
          <div>{this.state.text}</div>
        </Grid>
      </div>
    )
  }
}

export default ShortAnswerPreview;
