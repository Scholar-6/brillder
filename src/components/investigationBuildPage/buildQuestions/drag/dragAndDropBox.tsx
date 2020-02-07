import React, {useRef} from 'react'
import { useDrop, useDrag, DragSourceMonitor } from 'react-dnd'

import ItemTypes from '../../ItemTypes'
import { QuestionComponentTypeEnum } from '../../../model/question'
import { DropResult } from './interfaces'


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
  data: any
  onDrop: Function
  component: Function
  updateComponent(component:any):void
}

const DragAndDropBox: React.FC<DragAndBoxProps> = ({ value, index, onDrop, data, component, updateComponent }) => {
  const ref = useRef<HTMLDivElement>(null)  
   
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: () => ({ index, value, allowedDropEffect: "any" }),
    collect: (monitor: any) => (
      { isOver: monitor.isOver(), canDrop: monitor.canDrop() }
    ),
  })

  const item = { name: "", type: ItemTypes.BOX }
  const [{ opacity }, drag] = useDrag({
    item,
    end(item: { name: string } | undefined, monitor: DragSourceMonitor) {
      const dropResult: DropResult = monitor.getDropResult()
      if (item && dropResult) {
        const isDropAllowed =
          dropResult.allowedDropEffect === 'any' ||
          dropResult.allowedDropEffect === dropResult.dropEffect
        if (isDropAllowed) {
          onDrop({index, value}, {index: dropResult.index, value: dropResult.value});
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
  let backgroundColor = selectBackgroundColor(isActive, canDrop)
  if (value != QuestionComponentTypeEnum.None) {
    backgroundColor = 'white';
  }
  drag(drop(ref))

  return (
    <div ref={ref} className="drag-and-drop-box" style={{ backgroundColor, width: '100%', opacity }}>
      {component({data, updateComponent})}
    </div>
  )
}

export default DragAndDropBox
