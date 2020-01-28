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
  moveCard: (dragIndex: number, hoverIndex: number) => void,
  selectQuestion: Function,
  removeQuestion: Function
}

interface DragItem {
  index: number
  id: string
  type: string,
}

const DragTab: React.FC<DragTabProps> = ({ id, index, active, moveCard, selectQuestion, removeQuestion }) => {
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

  const removeTab = (event: React.ChangeEvent<any>) => {
    event.stopPropagation();
    removeQuestion(index);
  }

  const activateTab = () => {
    selectQuestion(index);
  }

  return (
    <div className="draggable-tab" onClick={activateTab} ref={ref} style={{ ...style, opacity }}>
      <CircleIconNumber number={index+1} customClass="" />
      {
        active == true && <ClearIcon className="remove-icon" onClick={removeTab} />
      }
    </div>
  )
}

export default DragTab
