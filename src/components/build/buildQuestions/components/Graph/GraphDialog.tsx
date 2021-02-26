import React from 'react';
import Dialog from '@material-ui/core/Dialog';
//@ts-ignore
import Desmos from 'desmos';

import { GraphSettings } from './Graph';

import './GraphDialog.scss';

interface GraphContainerProps {
  graphState: any;
  setGraphState(state: any): void;
}

const GraphContainer: React.FC<GraphContainerProps> = props => {
  const graphCallback = React.useCallback(elt => {
    if(elt) {
      var calculator = Desmos.GraphingCalculator(elt, {
        fontSize: Desmos.FontSizes.VERY_SMALL,
        administerSecretFolders: true
      });
      if(props.graphState) {
        calculator.setState(props.graphState);
      }
      calculator.observeEvent('change', () => {
        props.setGraphState(calculator.getState());
      });
    }
  }, []);

  return <div className="graph-dialog-desmos" ref={graphCallback} />
};

interface GraphDialogProps {
  isOpen: boolean;
  graphState: any;
  graphSettings: GraphSettings;
  close(): void;
  setGraphState(state: any): void;
}

const GraphDialog: React.FC<GraphDialogProps> = props => {

  return (
  <Dialog
    open={props.isOpen}
    onClose={props.close}
    className="dialog-box light-blue graph-dialog"
  >
    <GraphContainer
      graphState={props.graphState}
      setGraphState={props.setGraphState}
    />
  </Dialog>
  );
};

export default GraphDialog;