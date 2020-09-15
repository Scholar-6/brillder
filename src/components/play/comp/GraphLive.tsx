import React, { useEffect } from 'react';
//@ts-ignore
import Desmos from 'desmos';

import './GraphLive.scss';


interface ImageProps {
  component: any;
}

const GraphLive: React.FC<ImageProps> = ({ component }) => {
  const graphRef = React.useRef<HTMLDivElement>(null);
  const [calculator, setCalculator] = React.useState<any>(null);

  useEffect(() => {
    const state = component.graphState;
    const settings = component.graphSettings;
    console.log(graphRef);
    if(graphRef && graphRef.current) {
      if(calculator) {
        calculator.destroy();
      }
      var elt = graphRef.current;
      const desmos = Desmos.GraphingCalculator(elt, {
        fontSize: Desmos.FontSizes.VERY_SMALL,
        expressions: settings?.showSidebar ?? false,
        settingsMenu: settings?.showSettings ?? false,
        lockViewport: !(settings?.allowPanning ?? false),
        pointsOfInterest: settings?.pointsOfInterest ?? false,
        trace: settings?.trace ?? false
      });
      desmos.setState(state);
      setCalculator(desmos);
    }
  }, [graphRef.current])

  useEffect(() => {
    const state = component.graphState;
    const settings = component.graphSettings;
    if(calculator) {
      calculator.setState(state);
      calculator.updateSettings({
        expressions: settings?.showSidebar ?? false,
        settingsMenu: settings?.showSettings ?? false,
        lockViewport: !(settings?.allowPanning ?? false),
        pointsOfInterest: settings?.pointsOfInterest ?? false,
        trace: settings?.trace ?? false
      })
    }
  }, [component.graphState, component.graphSettings]);

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
