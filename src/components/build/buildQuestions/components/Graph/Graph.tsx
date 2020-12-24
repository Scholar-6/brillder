import React, { useEffect } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
//@ts-ignore
import Desmos from 'desmos';

import './Graph.scss';
import { Fab, SvgIcon, Tooltip } from '@material-ui/core';
import GraphDialog from './GraphDialog';

import sprite from 'assets/img/icons-sprite.svg';

export interface GraphSettings {
    showSidebar: boolean;
    showSettings: boolean;
    allowPanning: boolean;
    trace: boolean;
    pointsOfInterest: boolean;
}

const settingNames: (keyof GraphSettings)[] = ["showSidebar", "showSettings", "allowPanning", "trace", "pointsOfInterest"];

interface GraphProps {
    locked: boolean;
    index: number;
    data: any;
    save(): void;
    updateComponent(component: any, index: number): void;
    // phone preview
    onFocus(): void;
}

const GraphComponent: React.FC<GraphProps> = (props) => {
    const graphRef = React.useRef<HTMLDivElement>(null);
    const [calculator, setCalculator] = React.useState<any>(null);

    const initialProps = React.useRef(props);

    const [graphState, setGraphState] = React.useState<any>(props.data.graphState ?? null);
    const [graphSettings, setGraphSettings] = React.useState<GraphSettings>(props.data.graphSettings ?? {
        showSidebar: false,
        showSettings: false,
        allowPanning: false,
        trace: false,
        pointsOfInterest: false
    });

    const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

    useEffect(() => {
        if(graphRef && graphRef.current) {
            var elt = graphRef.current;
            const desmos = Desmos.GraphingCalculator(elt, {
              fontSize: Desmos.FontSizes.VERY_SMALL,
              expressions: false,
              settingsMenu: false,
              lockViewport: true,
              pointsOfInterest: true,
              trace: true
            });
            desmos.setState(graphState);
            setCalculator((calc: any) => {
                if(calc) {
                    calc.destroy();
                }
                return desmos
            });
        }
    // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const state = graphState;
        if(calculator) {
          calculator.setState(state);
        }
    }, [graphState, graphSettings, calculator]);

    useEffect(() => {
        let comp = Object.assign({}, initialProps.current.data);
        comp.graphState = graphState;
        comp.graphSettings = graphSettings;
        console.log("Saving...")
        initialProps.current.updateComponent(comp, initialProps.current.index);
        initialProps.current.save();
    }, [graphState, graphSettings]);

    const setGraphSetting = (evt: React.MouseEvent<HTMLElement>, newSettings: string[]) => {
        setGraphSettings(Object.fromEntries(settingNames.map(name => 
            [name, newSettings.findIndex(s => s === name) !== -1])) as any);
    }

    const getGraphSettings = () => {
        const settings = settingNames.filter(name => graphSettings[name] === true);
        return settings;
    }

    return (
    <div className="question-component-graph-container" onClick={props.onFocus}>
        <div className="question-component-graph-header">Graph</div>
        <div className="question-component-graph" ref={graphRef} />
        
        <GraphDialog
            graphState={graphState}
            graphSettings={graphSettings}
            isOpen={dialogOpen}
            close={() => setDialogOpen(false)}
            setGraphState={setGraphState}
            setGraphSettings={setGraphSettings}
        />
        <div className="question-component-graph-settings">
            <Tooltip title="Add / Edit Expressions">
                <Fab onClick={() => setDialogOpen(true)} color="primary">
                    <SvgIcon fontSize="default">
                        <svg className="svg active">
                            {/*eslint-disable-next-line*/}
                            <use href={sprite + "#edit-outline"} />
                        </svg>
                    </SvgIcon>
                </Fab>
            </Tooltip>
            <ToggleButtonGroup size="medium" value={getGraphSettings()} onChange={setGraphSetting}>
                <ToggleButton value="allowPanning">
                    <Tooltip title="Allow Pan / Zoom">
                        <SvgIcon fontSize="default">
                            <svg className="svg active">
                                {/*eslint-disable-next-line*/}
                                <use href={sprite + "#feather-search"} />
                            </svg>
                        </SvgIcon>
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="showSidebar">
                    <Tooltip title="Show Expressions">
                        <SvgIcon fontSize="large">
                            <svg className="svg active" viewBox="0 0 24 24">
                                {/*eslint-disable-next-line*/}
                                <text x="50%" y="55%" className="fx" dominantBaseline="middle">f(x)</text>
                            </svg>
                        </SvgIcon>
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="trace">
                    <Tooltip title="Allow Tracing">
                        <SvgIcon fontSize="large">
                            <svg className="svg active" viewBox="0 0 24 24">
                                {/*eslint-disable-next-line*/}
                                <use href={sprite + "#graph-tracing"} />
                            </svg>
                        </SvgIcon>
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="pointsOfInterest" disabled={!graphSettings.trace}>
                    <Tooltip title="Show Points of Interest">
                        <SvgIcon fontSize="large">
                            <svg className="svg active" viewBox="0 0 24 24">
                                {/*eslint-disable-next-line*/}
                                <use href={sprite + "#graph-poi"} />
                            </svg>
                        </SvgIcon>
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="showSettings">
                    <Tooltip title="Show Graph Settings">
                        <SvgIcon fontSize="default">
                            <svg className="svg active">
                                {/*eslint-disable-next-line*/}
                                <use href={sprite + "#settings"} />
                            </svg>
                        </SvgIcon>
                    </Tooltip>
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    </div>
    )
}

export default GraphComponent;