import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import ItemTypes from '../ItemTypes'
import CircleIconNumber from '../circleIcon'

const style = {}

export interface CardProps {
  id: any
  text: string
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}
const DragTab: React.FC<CardProps> = ({ id, text, index, moveCard }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover(item: DragItem) {
      if (!ref.current) { return }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) { return }

      moveCard(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD, id, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  return (
    <div className="draggable-tab" ref={ref} style={{ ...style, opacity }}>
      <CircleIconNumber number={id} customClass="" />
    </div>
  )
}

export default DragTab
