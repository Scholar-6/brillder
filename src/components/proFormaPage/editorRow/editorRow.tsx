import React, { Component } from 'react';
import { Box, Grid } from '@material-ui/core';
import { connect } from 'react-redux';

type ProFormaProps = {
  data: {
    editor: string,
    author: string,
    comissionTime: string
  }
}

const mapState = (state: any) => {
  return {
    data: state.proForm.data
  }
}

const connector = connect(mapState)

class EditorRowComponent extends Component<ProFormaProps> {
  constructor(props: any) {
    super(props)
  }
  render() {
    let editorName = '';
    let authorName = '';
    let comissionTime = '';
    const { data } = this.props;
    if (data != null) {
      editorName = data.editor;
      authorName = data.author;
      comissionTime = data.comissionTime;
    }
    return (
      <div>
        <Grid container direction="row">
          <Grid container item xs={12} sm={7} md={5} lg={3}>
            <Grid container direction="row">
              <Grid container item xs={3} className="row">
                <Box className="text-box" bgcolor="primary.main"><div>Editor:</div></Box>
              </Grid>
              <Grid container item xs={5} className="row">
                <Box className="text-box" bgcolor="primary.main">{editorName}</Box>
              </Grid>
              <Grid container item xs={4} className="row">
                <Box className="text-box" bgcolor="primary.main">Commision:</Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid container item xs={12} sm={7} md={5} lg={3}>
            <Grid container direction="row">
              <Grid container item xs={3} className="row">
                <Box className="text-box" bgcolor="primary.main">Author:</Box>
              </Grid>
              <Grid container item xs={5} className="row">
                <Box className="text-box" bgcolor="primary.main">{authorName}</Box>
              </Grid>
              <Grid container item xs={4} className="row">
                <Box className="text-box" bgcolor="primary.main">{comissionTime}</Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container direction="row">
          <Grid container item xs={12} sm={12} md={12} lg={10}>
            <Grid container direction="row" className="row">
              <Grid container item xs={4}></Grid>
              <Grid container item xs={8} sm={5}>
                <Box className="center-text-box" bgcolor="primary.main"><b>PRO FORMA</b></Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default connector(EditorRowComponent);
