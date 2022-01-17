import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Dialog from '@material-ui/core/Dialog';
import { connect } from 'react-redux';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { ListItemIcon, ListItemText, MenuItem, Popper, SvgIcon } from '@material-ui/core';


import './AssignBrickClass.scss';
import actions from 'redux/actions/requestFailed';
import { Brick } from 'model/brick';
import SpriteIcon from '../SpriteIcon';
import TimeDropdowns from '../timeDropdowns/TimeDropdowns';
import { getPublishedBricks } from 'services/axios/brick';
import map from 'components/map';
import { AssignClassData, assignClasses } from 'services/axios/assignBrick';
import BrickTitle from '../BrickTitle';
import { stripHtml } from 'components/build/questionService/ConvertService';
import ValidationFailedDialog from './ValidationFailedDialog';
import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';

interface AssignPersonOrClassProps {
  classroomId: number;
  subjectId: number;
  isOpen: boolean;
  success(brick: Brick): void;
  failed(brick: Brick): void;
  close(): void;

  user: User;
  requestFailed(e: string): void;
}

const PopperCustom = function (props: any) {
  return (<Popper {...props} className="assign-brick-class-poopper" />)
}

const AssignBrickClassDialog: React.FC<AssignPersonOrClassProps> = (props) => {
  const [alreadyAssigned, setAssigned] = useState(false);
  const [bricks, setBricks] = useState([] as any[]);
  const [brick, setBrick] = useState(null as any);
  /*eslint-disable-next-line*/
  const [deadlineDate, setDeadline] = useState(new Date());
  const [haveDeadline, toggleDeadline] = useState(false);

  const history = useHistory();

  const loadBricks = async () => {
    const bricks = await getPublishedBricks();
    if (bricks) {
      setBricks(bricks.filter(b => b.isCore === true || b.author.id == props.user.id));
    }
  }

  useEffect(() => { loadBricks() }, []);

  const assignToClasses = async (classesIds: Number[]) => {
    if (!brick || !brick.id) {
      return;
    }

    const data = { classesIds, deadline: null } as AssignClassData;

    if (haveDeadline && deadlineDate) {
      data.deadline = deadlineDate;
    }

    const res = await assignClasses(brick.id, data);
    if (res === false) {
      props.requestFailed('Can`t assign class to brick');
    }
    if (props.user && props.user.freeAssignmentsLeft) {
      props.user.freeAssignmentsLeft = props.user.freeAssignmentsLeft - 1;
    }
    return res;
  }

  const assign = async () => {
    const res = await assignToClasses([props.classroomId]); // empty array if succss
    if (res === false) {
      props.failed(brick);
    } else {
      if (res && res.length > 0) {
        let allArchived = true;
        for (let a of res) {
          if (a.isArchived !== true) {
            allArchived = false;
          }
        }
        if (allArchived) {
          props.success(brick);
        } else {
          setAssigned(true);
          return;
        }
      }
    }
    props.close();
  }

  return (
    <div>
      <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue assign-dialog assign-dialog-new">
        <div className="dialog-header">
          {props.user.freeAssignmentsLeft && <div className="assignments-count">{props.user.freeAssignmentsLeft} free Assignments left</div>}
          <div className="r-popup-title bold">Already know what you're looking for?</div>
          <Autocomplete
            freeSolo
            value={brick}
            options={bricks}
            onChange={(e: any, v: any) => setBrick(v)}
            noOptionsText="Sorry, try typing something else"
            className="subject-autocomplete"
            PopperComponent={PopperCustom}
            getOptionLabel={(option: any) => stripHtml(option.title)}
            renderOption={(brick: Brick) => (
              <React.Fragment>
                <MenuItem>
                  <ListItemIcon>
                    <SvgIcon>
                      <SpriteIcon
                        name="circle-filled"
                        className="w100 h100 active"
                        style={{ color: brick.subject?.color || '' }}
                      />
                    </SvgIcon>
                  </ListItemIcon>
                  <ListItemText>
                    <BrickTitle title={brick.title} />
                  </ListItemText>
                </MenuItem>
              </React.Fragment>
            )}
            renderInput={(params: any) => (
              <TextField
                {...params}
                variant="standard"
                label=""
                placeholder="Search for a brick you know, or try your luck!"
              />
            )}
          />
          {brick ?
            <div>
              <div className="r-popup-title bold">When is it due?</div>
              <div className="r-radio-buttons">
                <FormControlLabel
                  checked={haveDeadline === false}
                  control={<Radio onClick={() => toggleDeadline(false)} />}
                  label="No deadline"
                />
                <FormControlLabel
                  checked={haveDeadline === true}
                  control={<Radio onClick={() => toggleDeadline(true)} />}
                  label="Set date"
                />
                {haveDeadline && <TimeDropdowns date={deadlineDate} onChange={setDeadline} />}
              </div>
            </div> :
            <div>
              <div className="text-with-glasses">
                Or click the
                <div className="glasses pointer">
                  <div className="eye-glass-icon" onClick={() => history.push(map.ViewAllPage + '?subjectId=' + props.subjectId)} >
                    <div className="eye-glass-frame svgOnHover">
                      <SpriteIcon name="glasses-home" className="active text-theme-orange" />
                    </div>
                    <div className="glass-eyes-left svgOnHover">
                      <SpriteIcon name="eye-ball" className="active eye-ball text-white" />
                      <div className="glass-right-inside svgOnHover">
                        {/* <SpriteIcon name="aperture" className="aperture" /> */}
                        <SpriteIcon name="eye-pupil" className="eye-pupil" />
                      </div>
                    </div>
                    <div className="glass-eyes-right svgOnHover">
                      <SpriteIcon name="eye-ball" className="active eye-ball text-white" />
                      <div className="glass-right-inside svgOnHover">
                        {/* <SpriteIcon name="aperture" className="aperture" /> */}
                        <SpriteIcon name="eye-pupil" className="eye-pupil" />
                      </div>
                    </div>
                  </div>
                </div>
                to explore
              </div>
            </div>}
          <div className="dialog-footer centered-important" style={{ justifyContent: 'center' }}>
            <button className={brick ? "btn btn-md bg-theme-orange yes-button icon-button" : "btn btn-md b-dark-blue text-theme-light-blue yes-button icon-button"} onClick={assign} style={{ width: 'auto' }}>
              <div className="centered">
                <span className="label">Assign</span>
                <SpriteIcon name="file-plus" />
              </div>
            </button>
          </div>
        </div>
      </Dialog>
      <ValidationFailedDialog isOpen={alreadyAssigned} close={() => { setAssigned(false); props.close() }} header="This brick has already been assigned to this class." />
    </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

const connector = connect(mapState, mapDispatch);

export default connector(AssignBrickClassDialog);
