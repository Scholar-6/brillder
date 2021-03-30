import React from 'react';
import {  Hidden, Grid } from '@material-ui/core';

import './PhonePreview.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';


export interface PhonePreviewProps {
  link?: string;
  Component?: any;
  data?: any;
  action?(): any;
  nextDisabled?: boolean;
  prevDisabled?: boolean;
  prev?(): void;
  next?(): void;
}

const PhonePreview: React.FC<PhonePreviewProps> = ({ link, Component, data, action, ...props }) => {
  const [questionPreview] = React.useState(React.createRef() as React.RefObject<HTMLDivElement>);

  //#region Scroll
  const [canScroll, setScroll] = React.useState(false);

  const scrollUp = () => {
    try {
      if (questionPreview.current) {
        questionPreview.current.scrollBy(0, -50);
      }
    } catch {}
  }

  const scrollDown = () => {
    try {
      if (questionPreview.current) {
        let el = questionPreview.current;
        el.scrollBy(0, 50);
      }
    } catch {}
  }

  const checkScroll = () => {
    const {current} = questionPreview;
    if (current) {
      if (current.scrollHeight > current.clientHeight) {
        if (!canScroll) {
          setScroll(true);
        }
      } else {
        if (canScroll) {
          setScroll(false);
        }
      }
    }
  }
  //#endregion

  const renderInner = () => {
    if (link) {
      return <iframe title="phone-preview-screen" src={link} />;
    }
    if (Component) {
      setTimeout(() => { checkScroll(); }, 100);
      return <Component data={data} action={action} />;
    }
    return "";
  }

  return (
    <Hidden only={['xs', 'sm']}>
      <div className="phone-question-preview-box">
        <Grid container alignContent="center" justify="center" style={{height: '100%'}}>
          { props.prev &&
            <div className="centered pointer">
              <SpriteIcon name="arrow-left" className={`scroll-arrow ${props.prevDisabled && 'disabled'}`} onClick={props.prev} />
            </div>
          }
          <div className="phone-question-preview">
            <div className="centered">
              <SpriteIcon name="arrow-up" className={`scroll-arrow ${!canScroll && 'disabled'}`} onClick={scrollUp} />
            </div>
            <div className="phone">
              <div className="phone-border">
                <div className="volume volume1"></div>
                <div className="volume volume2"></div>
                <div className="volume volume3"></div>
                <div className="sleep"></div>
                <div className="screen">
                  <div className="custom-component" ref={questionPreview}>
                    {renderInner()}
                  </div>
                </div>
              </div>
            </div>
            <div className="centered">
              <SpriteIcon name="arrow-down" className={`scroll-arrow ${!canScroll && 'disabled'}`} onClick={scrollDown} />
            </div>
          </div>
          { props.next &&
            <div className="centered pointer">
              <SpriteIcon name="arrow-right" className={`scroll-arrow ${props.nextDisabled && 'disabled'}`} onClick={() => props.next?.()} />
            </div>
          }
        </Grid>
      </div>
    </Hidden>
  );
}

export default PhonePreview;
