import React, { useEffect } from 'react';
//@ts-ignore
import Desmos from 'desmos';

import './GraphLive.scss';


interface GraphProps {
  refs?: any;
  component: any;
}

const GraphLive: React.FC<GraphProps> = ({ component, refs }) => {
  const [calculator, setCalculator] = React.useState<any>(null);

  const graphCallback = React.useCallback(elt => {
    const state = component.graphState;
    const settings = component.graphSettings;
    if(elt) {
      const desmos = Desmos.GraphingCalculator(elt, {
        fontSize: Desmos.FontSizes.VERY_SMALL,
        expressions: settings?.showSidebar ?? false,
        settingsMenu: settings?.showSettings ?? false,
        lockViewport: !(settings?.allowPanning ?? false),
        pointsOfInterest: settings?.pointsOfInterest ?? false,
        trace: settings?.trace ?? false
      });
      desmos.setState(state);
      setCalculator((calc: any) => {
        if(calc) {
          calc.destroy();
        }
        return desmos;
      });
    }
  }, [component.graphState, component.graphSettings])

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
  }, [component.graphState, component.graphSettings, calculator]);

  if (component.graphState) {
    return (
    <div className="graph-component-container" ref={refs}>
      <div className="graph-component" ref={graphCallback} />
    </div>
    );
  }

  return <div></div>;
}

export default GraphLive;
