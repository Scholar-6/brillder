import React from 'react'
import { useDrop } from 'react-dnd'

import './DragDustbin.scss'
import ItemTypes from '../../ItemTypes'

export interface DustbinProps {
  allowedDropEffect: string
}

function selectBackgroundColor(isActive: boolean, canDrop: boolean) {
  if (isActive) {
    return 'darkgreen'
  } else if (canDrop) {
    return 'darkkhaki'
  } else {
    return '#E5E5E5'
  }
}

const Dustbin: React.FC<DustbinProps> = ({ allowedDropEffect }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: () => ({
      name: `${allowedDropEffect} Dustbin`,
      allowedDropEffect,
    }),
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const isActive = canDrop && isOver
  const backgroundColor = selectBackgroundColor(isActive, canDrop)
  return (
    <div ref={drop} className="drop-box-item" style={{ backgroundColor }}>
      {`Drag component here`}
    </div>
  )
}
export default Dustbin
