import React, {useRef} from 'react'
import { useDrop, useDrag, DragSourceMonitor } from 'react-dnd'

import './DragDustbin.scss'
import ItemTypes from '../../ItemTypes'
import { QuestionComponentTypeEnum } from '../../../model/question'


interface DropResult {
 allowedDropEffect: string
  dropEffect: string
  value: number,
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

export interface DragAndBoxProps {
    index: number
    value: QuestionComponentTypeEnum
    onDrop: Function
    component: Function
  }

const DragAndDropBox: React.FC<DragAndBoxProps> = ({ value, index, onDrop, component }) => {
  const ref = useRef<HTMLDivElement>(null)  
   
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: () => ({ value: index, allowedDropEffect: "any" }),
    collect: (monitor: any) => (
      { isOver: monitor.isOver(), canDrop: monitor.canDrop() }
    ),
  })

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
          onDrop(value, dropResult.value);
        } else {
          alert(`You cannot ${dropResult.dropEffect} an item into the ${dropResult.value}`);
        }
      }
    },
    collect: (monitor: any) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  })

  const isActive = canDrop && isOver
  const backgroundColor = selectBackgroundColor(isActive, canDrop)
  drag(drop(ref))

  return (
    <div ref={ref} className="drop-box-item" style={{ backgroundColor, opacity }}>
      {component()}
    </div>
  )
}

export default DragAndDropBox
