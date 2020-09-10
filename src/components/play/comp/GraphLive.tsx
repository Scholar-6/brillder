import React, { useEffect } from 'react';
//@ts-ignore
import Desmos from 'desmos';

import './GraphLive.scss';


interface ImageProps {
  component: any;
}

const GraphLive: React.FC<ImageProps> = ({ component }) => {
  const graphRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const state = component.graphState;
    const settings = component.graphSettings;
    if(graphRef && graphRef.current) {
      var elt = graphRef.current
      const calculator = Desmos.GraphingCalculator(elt, {
        expressions: settings?.showSidebar ?? false,
        settingsMenu: settings?.showSettings ?? false,
        lockViewport: !(settings?.allowPanning ?? false),
        pointsOfInterest: settings?.pointsOfInterest ?? false,
        trace: settings?.trace ?? false
      });
      calculator.setState(state);
    }
  }, [graphRef])

  if (component.graphState) {
    return (
    <div className="graph-component-container">
      <div className="graph-component" ref={graphRef} />
    </div>
    );
  }

  return <div></div>;
}

export default GraphLive;
