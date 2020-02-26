import React, { Fragment, Component } from 'react'
import { useDrag, DragSourceMonitor } from 'react-dnd'
import { Grid } from '@material-ui/core';
import MediaQuery from 'react-responsive';

import './dragBox.scss';
import ItemTypes from '../../ItemTypes'
import { QuestionComponentTypeEnum } from 'components/model/question';
import { DropResult } from './interfaces';


const HoverBox = ({ marginTop, label }: any) => {
  return (
    <Fragment>
      <MediaQuery minDeviceWidth={1280}>
        <div className="drag-box-hover" style={{ marginTop }}>{label}</div>
      </MediaQuery>
      <MediaQuery maxDeviceWidth={1280}>
        <div className="drag-box-hover" style={{ marginTop }}>{label}</div>
      </MediaQuery>
    </Fragment>
  );
}

export interface BoxProps {
  name?: string,
  value: QuestionComponentTypeEnum,
  isImage?: boolean,
  label?: string,
  src?: string,
  fontSize?: string,
  marginTop?: any,
  hoverMarginTop?: any,
  onDrop: Function,
}

const DragBox: React.FC<BoxProps> = ({ name, onDrop, value, fontSize, isImage, src, label, marginTop, hoverMarginTop }) => {
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
          onDrop(value, { value: dropResult.value, index: dropResult.index });
        } else {
          alert(`You cannot ${dropResult.dropEffect} an item into the ${dropResult.value}`);
        }
      }
    },
    collect: (monitor: any) => ({
      opacity: monitor.isDragging() ? 0.9 : 1,
    }),
  })

  const renderContent = () => {
    if (isImage) {
      return <div>
        <img alt="" style={{ width: '35%' }} src={src} />
        <HoverBox label={label} marginTop={hoverMarginTop} />
      </div>
    }
    return (
      <div>
        <div className="drag-box-name">{name}</div>
        <HoverBox label={label} marginTop={hoverMarginTop} />
      </div>
    );
  }

  return (
    <Grid container item xs={12} ref={drag} className="drag-box-item" style={{ opacity, fontSize: fontSize, marginTop }}>
      {renderContent()}
    </Grid>
  )
}

export default DragBox
