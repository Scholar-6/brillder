import React from 'react';
import { Hidden } from '@material-ui/core';

import './ProposalPhonePreview.scss';
import LastSave from '../../lastSave/LastSave';
import { YJSContext } from '../../YJSProvider';
import { TutorialStep } from 'components/build/tutorial/TutorialPanelWorkArea';


export interface ProposalPhonePreviewProps {
  link?: string
  Component?: any
  data?: any
}

const ProposalPhonePreview: React.FC<ProposalPhonePreviewProps> = ({ link, Component, data }) => {
  const { ydoc } = React.useContext(YJSContext)!;

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
        <LastSave
          isSaving={false}
          saveError={false}
          tutorialStep={TutorialStep.None}
          ybrick={ydoc.getMap("brick")}
        />
        <div className="phone">
          <div className="phone-border">
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
