
import React from 'react';
import {  Hidden } from '@material-ui/core';
// @ts-ignore
import Device from "react-device-frame";

import './PhonePreview.scss';


export interface PhonePreviewProps {
  link: string
}

const PhonePreview: React.FC<PhonePreviewProps> = ({ link }) => {
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
            <iframe src="http://front.scholar6.org/logo-page"></iframe>
          </div>
        </div>
      </div>
    </Hidden>
  );
}

export default PhonePreview;
