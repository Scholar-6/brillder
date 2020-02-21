import React from "react";
// @ts-ignore
import Device from "react-device-frame";
import { Hidden } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';

import './chooseSubject.scss';
import { NewBrickStep } from "../model";
import NextButton from '../components/nextButton'

enum Subject {
  None = 0,
  ArtAndDesign,
  Biology,
  Chemistry,
  EnglishLiterature,
  French,
  Geography,
  German,
  History,
  HistoryOfArt,
  Physics,
  Psychology,
  Sociology,
  Spanish,
  Theology,
  Classics,
}

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    center: {
      textAlign: 'center'
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }),
)(InputBase);

function ChooseSubject({saveSubject, selectedSubject}:any) {
  const [subject, setSubject] = React.useState(selectedSubject);
  
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSubject(event.target.value as number);
  };

  return (
    <div className="tutorial-page choose-subject-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={7} lg={8}>
          <div className="left-card">
            <h1 className="only-tutorial-header">Choose a subject for your brick</h1>
            <Select
              placeholder="Subject"
              labelId="customized-select-label"
              value={subject}
              style={{width: '90%'}}
              onChange={handleChange}
              input={<BootstrapInput />}
            >
              <MenuItem value={Subject.None} disabled>Choose Subject</MenuItem>
              <MenuItem value={Subject.ArtAndDesign}>Art & Design</MenuItem>
              <MenuItem value={Subject.Biology}>Biology</MenuItem>
              <MenuItem value={Subject.Chemistry}>Chemistry</MenuItem>
              <MenuItem value={Subject.Classics}>Classics</MenuItem>
              <MenuItem value={Subject.EnglishLiterature}>English Literature</MenuItem>
              <MenuItem value={Subject.French}>French</MenuItem>
              <MenuItem value={Subject.Geography}>Geography</MenuItem>
              <MenuItem value={Subject.German}>German</MenuItem>
              <MenuItem value={Subject.History}>History</MenuItem>
              <MenuItem value={Subject.HistoryOfArt}>History of Art</MenuItem>
              <MenuItem value={Subject.Physics}>Physics</MenuItem>
              <MenuItem value={Subject.Psychology}>Psychology</MenuItem>
              <MenuItem value={Subject.Sociology}>Sociology</MenuItem>
              <MenuItem value={Subject.Spanish}>Spanish</MenuItem>
              <MenuItem value={Subject.Theology}>Theology/Philosophy</MenuItem>
            </Select>
            <NextButton step={NewBrickStep.ChooseSubject} canSubmit={subject !== Subject.None} onSubmit={saveSubject} data={subject} />
          </div>
        </Grid>
        <Hidden only={['xs', 'sm']}>
          <Grid container justify="center" item md={5} lg={4}>
            <Device name="iphone-5s" use="iphone-5s" color="grey" url={window.location.origin + '/logo-page'} />
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
}

export default ChooseSubject
