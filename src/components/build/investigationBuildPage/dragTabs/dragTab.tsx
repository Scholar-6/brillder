import React from 'react'
import ClearIcon from '@material-ui/icons/Clear';
import { Grid } from '@material-ui/core';
const style = {}

export interface DragTabProps {
  id: any
  index: number,
  active: boolean,
  selectQuestion: Function,
  removeQuestion: Function
}

const DragTab: React.FC<DragTabProps> = ({ id, index, active, selectQuestion, removeQuestion }) => {
  const removeTab = (event: React.ChangeEvent<any>) => {
    event.stopPropagation();
    removeQuestion(index);
  }

  const activateTab = () => {
    selectQuestion(index);
  }

  return (
    <div className="draggable-tab" onClick={activateTab} style={{ ...style, height: '100%' }}>
      <Grid container direction="row" alignContent="center" style={{height: '95%'}}>
        <Grid item xs={10}  style={{color: 'black', fontFamily: 'Century Gothic Regular' }}>
          {index + 1}
        </Grid>
        <Grid item style={{position: 'absolute', right: 0}}>
          {
            active === true && <ClearIcon className="remove-icon" onClick={removeTab} />
          }
        </Grid>
      </Grid>
    </div>
  )
}

export default DragTab
