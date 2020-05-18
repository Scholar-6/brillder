import React from 'react';
import {  Hidden, Grid } from '@material-ui/core';

import './ProposalPhonePreview.scss';


export interface ProposalPhonePreviewProps {
  link?: string
  Component?: any
  data?: any
}

const ProposalPhonePreview: React.FC<ProposalPhonePreviewProps> = ({ link, Component, data }) => {
  const renderInner = () => {
    if (link) {
      return (
        <div className="custom-component">
          <iframe title="phone-preview-screen" src={link} />
        </div>
      );
    }
    if (Component) {
      return (
        <div className="custom-component">
          <Component data={data} />
        </div>
      );
    }
    return <div className="custom-component"/>;
  }

  return (
    <Hidden only={['xs', 'sm']}>
      <div className="proposal-phone-preview">
        <div className="phone">
          <div className="phone-border">
            <Grid container className="upper-panel">
              <div className="speaker"></div>
              <div className="camera"></div>
            </Grid>
            <div className="volume volume1"></div>
            <div className="volume volume2"></div>
            <div className="volume volume3"></div>
            <div className="sleep"></div>
            <div className="screen">
              {renderInner()}
            </div>
          </div>
        </div>
      </div>
    </Hidden>
  );
}

export default ProposalPhonePreview;
