import React from 'react'
import { useDrop } from 'react-dnd'
import ItemTypes from './ItemTypes'

const style: React.CSSProperties = {
  height: '1rem',
  width: '100%',
  color: 'white',
  padding: '30px',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
}

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
    <div ref={drop} style={{ ...style, backgroundColor }}>
      {`Drag component here`}
      <br />
      <br />
      {isActive ? 'Release to drop' : 'Drag component here'}
    </div>
  )
}
export default Dustbin
