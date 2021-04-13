import { generateId } from 'components/build/buildQuestions/questionTypes/service/questionBuild';
import React from 'react';
import SpriteIcon from '../SpriteIcon';

interface QuillGlobalToolbarSelectProps {
    name: string;
    
    enabled?: boolean;
    handler(name: string, value?: string): boolean | undefined;
    format?: any;
}

const QuillGlobalToolbarSelect: React.FC<QuillGlobalToolbarSelectProps> = props => {
    const [uniqueId] = React.useState(generateId());
    const [expanded, setExpanded] = React.useState(false);

    const getItem = (node: React.ReactElement) => {
        const name = node.props.children;
        const value = node.props.value;
        return <span className="ql-picker-item ql-primary" style={{ backgroundColor: value }} data-label={name} data-value={value} onClick={() => props.handler(props.name, value) ?? false}></span>;
    }

    return (
        <span
            
            className={`picker q-${props.name}${expanded ? " ql-expanded" : ""}${props.enabled ? "" : " disabled"}`}
            // onClick={() => props.handler(props.name, "") ?? false}
            onClick={() => props.enabled && setExpanded(e => !e)}
        >
            <span className="picker-label">
                <SpriteIcon name={"ql-" + props.name} />
            </span>
            <span id={`picker-options-${uniqueId}`} className="picker-options">
                { props.children && React.Children.map(props.children as any, getItem) }
            </span>
        </span>
    );
};

export default QuillGlobalToolbarSelect;