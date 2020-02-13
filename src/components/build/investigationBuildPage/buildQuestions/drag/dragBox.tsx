import React from 'react'
import { useDrag, DragSourceMonitor } from 'react-dnd'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

import './dragBox.scss';
import ItemTypes from '../../ItemTypes'
import { Grid } from '@material-ui/core';
import { QuestionComponentTypeEnum } from 'components/model/question';
import { DropResult } from './interfaces';


export interface BoxProps {
  name: string,
  value: QuestionComponentTypeEnum,
  onDrop: Function,
}

const DragBox: React.FC<BoxProps> = ({ name, onDrop, value }) => {
  const item = { name, type: ItemTypes.BOX }
  const [{ opacity }, drag] = useDrag({
    item,
    end(item: { name: string } | undefined, monitor: DragSourceMonitor) {
      const dropResult: DropResult = monitor.getDropResult()
      if (item && dropResult) {
        const isDropAllowed =
          dropResult.allowedDropEffect === 'any' ||
          dropResult.allowedDropEffect === dropResult.dropEffect
        if (isDropAllowed) {
          onDrop(value, {value: dropResult.value, index: dropResult.index});
        } else {
          alert(`You cannot ${dropResult.dropEffect} an item into the ${dropResult.value}`);
        }
      }
    },
    collect: (monitor: any) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  })

  return (
    <Grid container item xs={12} ref={drag} className="drag-box-item" style={{ opacity }}>
      <div>{name}</div>
      <DragIndicatorIcon />
    </Grid>
  )
}
export default DragBox
