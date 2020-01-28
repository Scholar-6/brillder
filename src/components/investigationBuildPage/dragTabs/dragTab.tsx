import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import ItemTypes from '../ItemTypes'
import CircleIconNumber from '../circleIcon'
import ClearIcon from '@material-ui/icons/Clear';
const style = {}

export interface DragTabProps {
  id: any
  index: number,
  active: boolean,
  moveCard: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

const DragTab: React.FC<DragTabProps> = ({ id, index, active, moveCard }) => {
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

  const removeQuestion = (event: React.ChangeEvent<any>) => {
    event.preventDefault();
    console.log("remove question");
  }

  const activateQuestion = (event: React.ChangeEvent<any>) => {
    event.preventDefault();
    console.log("activate question");
  }

  return (
    <div className="draggable-tab" onClick={activateQuestion} ref={ref} style={{ ...style, opacity }}>
      <CircleIconNumber number={id} customClass="" />
      {
        active == true && <ClearIcon className="remove-icon" onClick={removeQuestion} />
      }
    </div>
  )
}

export default DragTab
