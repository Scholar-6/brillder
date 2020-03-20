
import React from 'react';
import {  Hidden } from '@material-ui/core';
// @ts-ignore
import Device from "react-device-frame";

import './PhonePreview.scss';


export interface PhonePreviewProps {
  link?: string
  Component?: any
  data?: any
}

const PhonePreview: React.FC<PhonePreviewProps> = ({ link, Component, data }) => {
  return (
    <Hidden only={['xs', 'sm']}>
      <div className="phone-preview">
        <div className="phone">
          <div className="speaker"></div>
          <div className="camera"></div>
          <div className="sensor"></div>
          <div className="volume volume1"></div>
          <div className="volume volume2"></div>
          <div className="volume volume3"></div>
          <div className="screen">
            {
              link
                ? <div className="custom-component">
                    <iframe title="phone-preview-screen" src={link} />
                  </div>
                : <div className="custom-component"><Component data={data} /></div>
            }
          </div>
        </div>
      </div>
    </Hidden>
  );
}

export default PhonePreview;
