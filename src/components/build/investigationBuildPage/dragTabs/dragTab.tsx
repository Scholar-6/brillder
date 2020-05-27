import React from 'react'
import ClearIcon from '@material-ui/icons/Clear';
import { Grid } from '@material-ui/core';

export interface DragTabProps {
  id: any
  index: number,
  active: boolean,
  isValid: boolean,
  selectQuestion: Function,
  removeQuestion: Function
}

const DragTab: React.FC<DragTabProps> = ({ id, index, active, isValid, selectQuestion, removeQuestion }) => {
  const removeTab = (event: React.ChangeEvent<any>) => {
    event.stopPropagation();
    removeQuestion(index);
  }

  const activateTab = () => {
    selectQuestion(index);
  }

  return (
    <div className="draggable-tab" onClick={activateTab}>
      <Grid container direction="row" alignContent="center">
        <Grid item xs={active ? 10 : 12} className="tab-number">
          {index + 1}
        </Grid>
        <Grid item container direction="row" alignContent="center" justify="flex-end" className="remove-icon-container">
          {
            active === true && <img alt="" src="/feathericons/x-blue.png" className="remove-icon" onClick={removeTab} />
          }
        </Grid>
      </Grid>
    </div>
  )
}

export default DragTab
