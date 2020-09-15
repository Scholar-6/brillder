import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
//@ts-ignore
import Desmos from 'desmos';

import { GraphSettings } from './Graph';

interface GraphDialogProps {
  isOpen: boolean;
  graphState: any;
  graphSettings: GraphSettings;
  close(): void;
  setGraphState(state: any): void;
  setGraphSettings(settings: GraphSettings): void;
}

const GraphDialog: React.FC<GraphDialogProps> = props => {
  const graphRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(graphRef && graphRef.current) {
      var elt = graphRef.current;
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

  return (
  <Dialog
    open={props.isOpen}
    onClose={props.close}
    className="dialog-box light-blue"
  >
    <div className="question-component-graph" ref={graphRef} />
  </Dialog>
  );
};

export default GraphDialog;