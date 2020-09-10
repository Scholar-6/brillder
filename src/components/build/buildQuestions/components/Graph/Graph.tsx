import React, { useLayoutEffect, useEffect } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
//@ts-ignore
import Desmos from 'desmos';

import './Graph.scss';

interface GraphSettings {
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

    const [graphState, setGraphState] = React.useState<any>(undefined);
    const [graphSettings, setGraphSettings] = React.useState<GraphSettings>({
        showSidebar: false,
        showSettings: false,
        allowPanning: false,
        trace: false,
        pointsOfInterest: false
    });

    useEffect(() => {
        if(props.data.graphState) {
            setGraphState(props.data.graphState);
        }
        if(props.data.graphSettings) {
            setGraphSettings(props.data.graphSettings);
        }

        if(graphRef && graphRef.current) {
            var elt = graphRef.current;
            var calculator = Desmos.GraphingCalculator(elt, {
                fontSize: Desmos.FontSizes.VERY_SMALL,
                administerSecretFolders: true
            });
            if(props.data.graphState) {
                calculator.setState(props.data.graphState);
            }
            calculator.observeEvent('change', () => {
                setGraphState(calculator.getState());
            });
        }
    }, []);

    useEffect(() => {
        let comp = Object.assign({}, props.data);
        comp.graphState = graphState;
        comp.graphSettings = graphSettings;
        props.updateComponent(comp, props.index);
        props.save();
    }, [graphState, graphSettings]);

    const setGraphSetting = (key: string, value: boolean) => {
        setGraphSettings({
            ...graphSettings,
            [key]: value
        });
    }

    return (
    <div className="question-component-graph-container">
        <div className="question-component-graph-header">Graph</div>
        <div className="question-component-graph dont-drag" ref={graphRef}  draggable="true" onDragStart={(e) => e.preventDefault()}/>
        <div className="question-component-graph-settings">
            {settingNames.map((key) =>
            <div className="graph-setting" key={key}>
                <span>{settingsStrings[key]}</span>
                <Checkbox checked={graphSettings[key]} disabled={key === "pointsOfInterest" && !graphSettings.trace}
                    onChange={(el) => setGraphSetting(key, el.target.checked)} />
            </div>)}
        </div>
    </div>
    )
}

export default GraphComponent;