import React, { Component } from "react";
import Avatar from '@material-ui/core/Avatar';

import './VerticalShufflePreview.scss';
import { Grid } from "@material-ui/core";


class VerticalShufflePreview extends Component<any, any> {
  render() {
    return (
      <div className="phone-preview-component vertical-shuffle-preview">
        <Grid container justify="center" className="small-text">
          Place the following events in chronological order
        </Grid>
        <button>
          <div>
            <Grid container justify="center" alignContent="center" className="circle-number">
              <Avatar>1</Avatar>
            </Grid>
          </div>
          Trial of Socrates
        </button>
        <button>
          <div>
            <Grid container justify="center" alignContent="center" className="circle-number">
              <Avatar>2</Avatar>
            </Grid>
          </div>
          Alexander’s last lesson with Aristotle
        </button>
        <button>
          <div>
            <Grid container justify="center" alignContent="center" className="circle-number">
              <Avatar>3</Avatar>
            </Grid>
          </div>
          Philip II of Macedon assassinated
        </button>
      </div>
    )
  }
}

export default VerticalShufflePreview;
