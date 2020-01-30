import React from 'react'
import { useDrag, DragSourceMonitor } from 'react-dnd'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

import './DragBox.scss';
import ItemTypes from '../../ItemTypes'
import { Grid } from '@material-ui/core';


export interface BoxProps {
  name: string
}

interface DropResult {
  allowedDropEffect: string
  dropEffect: string
  name: string
}

const DragBox: React.FC<BoxProps> = ({ name }) => {
  const item = { name, type: ItemTypes.BOX }
  const [{ opacity }, drag] = useDrag({
    item,
    end(item: { name: string } | undefined, monitor: DragSourceMonitor) {
      const dropResult: DropResult = monitor.getDropResult()
      if (item && dropResult) {
        let alertMessage = ''
        const isDropAllowed =
          dropResult.allowedDropEffect === 'any' ||
          dropResult.allowedDropEffect === dropResult.dropEffect

        if (isDropAllowed) {
          const isCopyAction = dropResult.dropEffect === 'copy'
          const actionName = isCopyAction ? 'copied' : 'moved'
          alertMessage = `You ${actionName} ${item.name} into ${dropResult.name}!`
        } else {
          alertMessage = `You cannot ${dropResult.dropEffect} an item into the ${dropResult.name}`
        }
        alert(alertMessage)
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
