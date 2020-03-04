import React, {useRef} from 'react'
import { useDrop, useDrag, DragSourceMonitor } from 'react-dnd'

import ItemTypes from '../../ItemTypes'
import { QuestionComponentTypeEnum } from 'components/model/question';
import { DropResult } from './interfaces'


function selectBackgroundColor(isActive: boolean, canDrop: boolean) {
  if (isActive) {
    return 'darkgreen'
  } else if (canDrop) {
    return 'darkkhaki'
  } else {
    return '#d9d9d9'
  }
}

export interface DragAndBoxProps {
  locked: boolean
  index: number
  value: QuestionComponentTypeEnum
  data: any
  onDrop: Function
  component: React.FC<any>,
  cleanComponent(): void
  updateComponent(component:any, index:number):void
}

const DragAndDropBox: React.FC<DragAndBoxProps> = ({ locked, value, index, onDrop, data, component, cleanComponent, updateComponent }) => {
  let UniqueComponent = component;

  return (
    <div className="drag-and-drop-box" style={{ width: '100%' }}>
      <UniqueComponent locked={locked} data={data} cleanComponent={cleanComponent} updateComponent={updateComponent} />
    </div>
  )
}

export default DragAndDropBox
