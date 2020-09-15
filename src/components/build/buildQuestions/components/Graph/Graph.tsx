import React, { useLayoutEffect, useEffect } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
//@ts-ignore
import Desmos from 'desmos';

import './Graph.scss';
import { Button } from '@material-ui/core';
import GraphDialog from './GraphDialog';

export interface GraphSettings {
    showSidebar: boolean;
    showSettings: boolean;
    allowPanning: boolean;
    trace: boolean;
    pointsOfInterest: boolean;
}

const settingNames: (keyof GraphSettings)[] = ["showSidebar", "showSettings", "allowPanning", "trace", "pointsOfInterest"];

const settingsStrings: { [key: string]: string } = {
    showSidebar: "Show Sidebar",
    showSettings: "Show Settings",
    allowPanning: "Allow Pan / Zoom",
    trace: "Allow Tracing",
    pointsOfInterest: "Show Points of Interest",
}

interface GraphProps {
    locked: boolean;
    index: number;
    data: any;
    save(): void;
    updateComponent(component: any, index: number): void;
}

const GraphComponent: React.FC<GraphProps> = (props) => {
    const graphRef = React.useRef<HTMLDivElement>(null);
    const [calculator, setCalculator] = React.useState<any>(null);

    const [graphState, setGraphState] = React.useState<any>(undefined);
    const [graphSettings, setGraphSettings] = React.useState<GraphSettings>({
        showSidebar: false,
        showSettings: false,
        allowPanning: false,
        trace: false,
        pointsOfInterest: false
    });

    const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

    useEffect(() => {
        if(props.data.graphState) {
            setGraphState(props.data.graphState);
        }
        if(props.data.graphSettings) {
            setGraphSettings(props.data.graphSettings);
        }
        if(graphRef && graphRef.current) {
            const state = graphState;
            const settings = graphSettings;
            if(calculator) {
              calculator.destroy();
            }
            var elt = graphRef.current;
            const desmos = Desmos.GraphingCalculator(elt, {
              fontSize: Desmos.FontSizes.VERY_SMALL,
              expressions: false,
              settingsMenu: false,
              lockViewport: true,
              pointsOfInterest: true,
              trace: true
            });
            desmos.setState(state);
            setCalculator(desmos);
        }
    }, []);

    useEffect(() => {
        const state = graphState;
        const settings = graphSettings;
        if(calculator) {
          calculator.setState(state);
        }
    }, [graphState, graphSettings]);

    useEffect(() => {
        let comp = Object.assign({}, props.data);
        comp.graphState = graphState;
        comp.graphSettings = graphSettings;
        props.updateComponent(comp, props.index);
        props.save();
    }, [graphState, graphSettings]);

    const setGraphSetting = (evt: React.MouseEvent<HTMLElement>, newSettings: string[]) => {
        setGraphSettings(Object.fromEntries(settingNames.map(name => 
            [name, newSettings.findIndex(s => s === name) != -1])) as any);
    }

    const getGraphSettings = () => {
        const settings = settingNames.filter(name => graphSettings[name] === true);
        return settings;
    }

    return (
    <div className="question-component-graph-container">
        <div className="question-component-graph-header">Graph</div>
        <div className="question-component-graph" ref={graphRef} />
        <Button onClick={() => setDialogOpen(true)}>Edit Graph</Button>
        <GraphDialog
            graphState={graphState}
            graphSettings={graphSettings}
            isOpen={dialogOpen}
            close={() => setDialogOpen(false)}
            setGraphState={setGraphState}
            setGraphSettings={setGraphSettings}
        />
        <ToggleButtonGroup value={getGraphSettings()} onChange={setGraphSetting}>
            {Object.keys(graphSettings).map(key =>
            <ToggleButton key={key} value={key} disabled={key === "pointsOfInterest" && !graphSettings.trace}>
                {settingsStrings[key]}
            </ToggleButton>
            )}
        </ToggleButtonGroup>
    </div>
    )
}

export default GraphComponent;