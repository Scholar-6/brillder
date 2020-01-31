import React from 'react'
import { useDrag, DragSourceMonitor } from 'react-dnd'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

import ItemTypes from '../../ItemTypes'
import { QuestionComponentTypeEnum } from '../../../model/question';
import DragAndDropBox from '../components/DragAndDropBox';


export interface DragShortAnswerProps {
  index: number,
  value: string,
  onDrop: Function,
}

interface DropResult {
  allowedDropEffect: string
  dropEffect: string
  value: number,
}

const DraggableShortAnswer: React.FC<DragShortAnswerProps> = ({ index, value, onDrop }) => {
  const item = { name: "34", type: ItemTypes.BOX }
  const [{ opacity }, drag] = useDrag({
    item,
    end(item: { name: string } | undefined, monitor: DragSourceMonitor) {
      const dropResult: DropResult = monitor.getDropResult()
      if (item && dropResult) {
        const isDropAllowed =
          dropResult.allowedDropEffect === 'any' ||
          dropResult.allowedDropEffect === dropResult.dropEffect
        if (isDropAllowed) {
          onDrop(index, dropResult.value);
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
    <div className="input-box drag-box-item" ref={drag} style={{ opacity }}>
      <DragIndicatorIcon />
      <div>
        <input placeholder="Enter correct answer" />
      </div>
    </div>
  )
}
export default DraggableShortAnswer
