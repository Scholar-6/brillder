import React from 'react';
import './createBrickPage.scss';
import { Box, Grid } from '@material-ui/core';

const CreateBrickPage: React.FC = () => {
  return (
    <div className="create-brick-page">
      <Grid
        container
        direction="row">
        <Grid container item xs={10} sm={7} md={5} lg={3}>
          <Grid container direction="row">
            <Grid container item xs={3} className="row">
              <Box className="text-box" bgcolor="primary.main">Editor:</Box>
            </Grid>
            <Grid container item xs={5} className="row">
              <Box className="text-box" bgcolor="primary.main">E. Pound</Box>
            </Grid>
            <Grid container item xs={4} className="row">
              <Box className="text-box" bgcolor="primary.main">Commision:</Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        direction="row">
        <Grid container item xs={10} sm={7} md={5} lg={3}>
          <Grid container direction="row">
            <Grid container item xs={3} className="row">
              <Box className="text-box" bgcolor="primary.main">Author:</Box>
            </Grid>
            <Grid container item xs={5} className="row">
              <Box className="text-box" bgcolor="primary.main">R. Unstead</Box>
            </Grid>
            <Grid container item xs={4} className="row">
            <Box className="text-box" bgcolor="primary.main">40 minutes</Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        className="row">
          <Grid container item xs={3}></Grid>
          <Grid container item xs={5} sm={4} md={3} lg={2}>
            <Box className="center-text-box" bgcolor="primary.main"><b>PRO FORMA</b></Box>
          </Grid>
      </Grid>
      
      <Grid container direction="row">
        <Grid container item xs={12} sm={10} md={6} lg={5}>
          <Grid
            container
            direction="row"
            className="row">
              <Grid container item xs={4}>
                <Box className="right text-box" bgcolor="primary.main">Subject</Box>
              </Grid>
              <Grid container item xs={7}>
                <input placeholder="e.g. History"/>
              </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            className="row">
              <Grid container item xs={4}>
                <Box className="right text-box" bgcolor="primary.main">Topic</Box>
              </Grid>
              <Grid container item xs={7}>
                <input placeholder="e.g. Italy 1918 - 1939"/>
              </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            className="row">
              <Grid container item xs={4}>
                <Box className="right text-box" bgcolor="primary.main">Sub-topic</Box>
              </Grid>
              <Grid container item xs={7}>
                <input placeholder="e.g. Rise of Rascism"/>
              </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            className="row">
              <Grid container item xs={4}>
                <Box className="right text-box" bgcolor="primary.main">Alternative Topics</Box>
              </Grid>
              <Grid container item xs={7}>
                <input placeholder="e.g. 20th century Dictators" />
              </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            className="row">
              <Grid container item xs={4}>
                <Box className="right text-box" bgcolor="primary.main">Proposed Title</Box>
              </Grid>
              <Grid container item xs={7}>
                <input placeholder="e.g. The Italo-Abyssinian Wars" />
              </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            className="row">
              <Grid container item xs={4}>
                <Box className="right text-box" bgcolor="primary.main">Investigation Brief</Box>
              </Grid>
              <Grid container item xs={8}>
                <textarea placeholder="In less than 100 words, explain to the student what is going to be explored in the investigation"></textarea>
              </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            className="row">
              <Grid container item xs={4}>
                <Box className="right text-box" bgcolor="primary.main">Preparation Brief</Box>
              </Grid>
              <Grid container item xs={8}>
                <textarea placeholder="In less than 150 (including links), set a relevant task or tasks which the student can do independently before starting the investigation. Preparation should take 5, 10 or 15 minutes depending on whether the investigation is 20, 40 or 60 minutes long." />
              </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default CreateBrickPage;
