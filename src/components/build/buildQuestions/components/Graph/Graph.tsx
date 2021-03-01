import React, { useEffect } from 'react';
import Y from "yjs";
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
//@ts-ignore
import Desmos from 'desmos';

import './Graph.scss';
import { Fab, SvgIcon, Tooltip } from '@material-ui/core';
import GraphDialog from './GraphDialog';

import sprite from 'assets/img/icons-sprite.svg';
import { convertObject } from 'services/SharedTypeService';
import _ from 'lodash';

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
    data: Y.Map<any>;

    // phone preview
    onFocus(): void;
}

const GraphComponent: React.FC<GraphProps> = (props) => {
    const graphRef = React.useRef<HTMLDivElement>(null);
    const [calculator, setCalculator] = React.useState<any>(null);
    const value = props.data.get("value") as Y.Map<any>;
    const graphState = value.get("graphState")?.toJSON() ?? null;
    console.log(graphState);

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
    }, [graphState, calculator]);

    const setGraphState = React.useCallback((state: object) => {
        value.doc!.transact(() => {
            if(state && !_.isEmpty(state)) {
                const ystate = convertObject(state, false, false);
                value.set("graphState", ystate);
            }
        });
    }, [value]);

    const setGraphSetting = (evt: React.MouseEvent<HTMLElement>, newSettings: string[]) => {
        value.doc!.transact(() => {
            settingNames.map(name => {
                value.get("graphSettings").set(name, newSettings.findIndex(s => s === name) !== -1);
            });
        });
    }

    const getGraphSettings = () => {
        const settings = settingNames.filter(name => value.get("graphSettings").toJSON()[name] === true);
        return settings;
    }

    return (
    <div className="question-component-graph-container" onClick={props.onFocus}>
        <div className="question-component-graph-header">Graph</div>
        <div className="question-component-graph" ref={graphRef} />
        
        <GraphDialog
            graphState={graphState}
            graphSettings={value.get("graphSettings").toJSON()}
            isOpen={dialogOpen}
            close={() => setDialogOpen(false)}
            setGraphState={setGraphState}
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
                <ToggleButton value="pointsOfInterest" disabled={!value.get("graphSettings").toJSON().trace}>
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