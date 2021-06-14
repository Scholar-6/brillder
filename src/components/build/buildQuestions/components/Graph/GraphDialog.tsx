import React from 'react';
import Dialog from '@material-ui/core/Dialog';
//@ts-ignore
import Desmos from 'desmos';

import { GraphSettings } from './Graph';

import './GraphDialog.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface GraphDialogProps {
  isOpen: boolean;
  graphState: any;
  graphSettings: GraphSettings;
  close(): void;
  setGraphState(state: any): void;
  setGraphSettings(settings: GraphSettings): void;
}

const GraphDialog: React.FC<GraphDialogProps> = props => {
  const graphCallback = React.useCallback(elt => {
    if(elt) {
      var calculator = Desmos.GraphingCalculator(elt, {
        fontSize: Desmos.FontSizes.VERY_SMALL,
        administerSecretFolders: true
      });
      if(initialProps.current.graphState) {
        calculator.setState(initialProps.current.graphState);
      }
      calculator.observeEvent('change', () => {
        initialProps.current.setGraphState(calculator.getState());
      });
    }
  }, [])

  const initialProps = React.useRef(props);

  return (
  <Dialog
    open={props.isOpen}
    onClose={props.close}
    className="dialog-box light-blue graph-dialog"
  >
    <div className="close-button svgOnHover" onClick={props.close}>
      <SpriteIcon name="cancel" className="w100 h100 active" />
    </div>
    <div className="graph-dialog-desmos" ref={graphCallback} />
    <div className="centered last-button">
      <div className="upload-button active" onClick={props.close}>
        <div className="background" />
        <SpriteIcon name="upload" />
        <div className="css-custom-tooltip">Insert</div>
      </div>
    </div>
  </Dialog>
  );
};

export default GraphDialog;