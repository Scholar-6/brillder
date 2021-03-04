import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import { connect } from 'react-redux';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import './AssignBrickClass.scss';
import actions from 'redux/actions/requestFailed';
import { Brick } from 'model/brick';
import SpriteIcon from '../SpriteIcon';
import TimeDropdowns from '../timeDropdowns/TimeDropdowns';
import { getPublishedBricks } from 'services/axios/brick';

interface AssignPersonOrClassProps {
  classroomId: number;
  isOpen: boolean;
  success(brick: Brick): void;
  failed(brick: Brick): void;
  close(): void;

  requestFailed(e: string): void;
}

const AssignBrickClassDialog: React.FC<AssignPersonOrClassProps> = (props) => {
  const [bricks, setBricks] = React.useState([] as any[]);
  const [brick, setBrick] = React.useState(null as any);
  const [deadlineDate, setDeadline] = React.useState(null as null | Date);
  const [haveDeadline, toggleDeadline] = React.useState(null as boolean | null);

  const loadBricks = async () => {
    let bricks = await getPublishedBricks();
    if (bricks) {
      setBricks(bricks);
    }
  }

  useEffect(() => {loadBricks()}, []);

  const assignToClasses = async (classesIds: Number[]) => {
    if (!brick || !brick.id) {
      return;
    }
    return await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/brick/assignClasses/${brick.id}`,
      { classesIds },
      { withCredentials: true }
    ).then(res => {
      return res.data as any[];
    }).catch(() => {
      props.requestFailed('Can`t assign class to brick');
      return false;
    });
  }

  const assign = async () => {
    let res = await assignToClasses([props.classroomId]);
    if (res) {
      props.failed(brick);
    } else {
      props.success(brick);
    }
    props.close();
  }

  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue assign-dialog">
      <div className="dialog-header">
        <div className="r-popup-title bold">Select brick</div>
        <Autocomplete
          freeSolo
          value={brick}
          options={bricks}
          onChange={(e:any, v: any) => setBrick(v)}
          getOptionLabel={(option:any) => option.title}
          noOptionsText="Sorry, try typing something else"
          className="subject-autocomplete"
          renderInput={(params:any) => (
            <TextField
              {...params}
              variant="standard"
              label="Bricks: "
              placeholder="Bricks"
            />
          )}
        />
        <div className="r-popup-title bold">When is it due?</div>
        <div className="r-radio-buttons">
          <FormControlLabel
            checked={haveDeadline === false}
            control={<Radio onClick={() => toggleDeadline(false)}/>}
            label="No deadline"
          />
          <FormControlLabel
            checked={haveDeadline === true}
            control={<Radio onClick={() => toggleDeadline(true)}/>}
            label="Set date"
          />
        </div>
        <div className={haveDeadline ? 'r-day-date-row' : 'r-day-date-row r-hidden'}>
          <div>
            <TimeDropdowns onChange={setDeadline} />
          </div>
        </div>
        <div className="dialog-footer centered-important" style={{ justifyContent: 'center' }}>
          <button className="btn btn-md bg-theme-orange yes-button icon-button" onClick={assign} style={{ width: 'auto' }}>
            <div className="centered">
              <span className="label">Assign Brick</span>
              <SpriteIcon name="file-plus" />
            </div>
          </button>
        </div>
      </div>
    </Dialog>
  );
}

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

const connector = connect(null, mapDispatch);

export default connector(AssignBrickClassDialog);
