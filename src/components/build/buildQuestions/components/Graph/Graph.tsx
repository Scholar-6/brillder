import React, { useLayoutEffect, useEffect } from 'react';
//@ts-ignore
import Desmos from 'desmos';

import './Graph.scss';

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

    useEffect(() => {
        if(props.data.graphState) {
            console.log(props.data.graphState);
            setGraphState(props.data.graphState);
        }

        if(graphRef && graphRef.current) {
            var elt = graphRef.current;
            var calculator = Desmos.GraphingCalculator(elt, {
                fontSize: Desmos.FontSizes.VERY_SMALL
            });
            console.log(calculator);
            if(props.data.graphState) {
                console.log(props.data.graphState);
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
        props.updateComponent(comp, props.index);
        props.save();
    }, [graphState]);

    return (
    <div className="question-component-graph-container">
        <div className="question-component-graph-header">Graph</div>
        <div className="question-component-graph dont-drag" ref={graphRef}  draggable="true" onDragStart={(e) => {
            console.log("You tried to drag!")
            e.preventDefault();
            //e.stopPropagation();
        }}/>
    </div>
    )
}

export default GraphComponent;