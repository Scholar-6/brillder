
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
        <Device name="iphone-5s" use="iphone-5s" color="grey" url={window.location.origin + '/logo-page'} />
      </div>
    </Hidden>
  );
}

export default PhonePreview;
