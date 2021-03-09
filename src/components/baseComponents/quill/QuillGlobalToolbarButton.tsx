import React from 'react';
import SpriteIcon from '../SpriteIcon';

interface QuillGlobalToolbarButtonProps {
    name: string;
    value?: string;
    
    enabled?: boolean;
    handler(name: string, value?: string): boolean | undefined;
    format?: any;
}

const QuillGlobalToolbarButton: React.FC<QuillGlobalToolbarButtonProps> = props => {
    return (
        <button
            disabled={!props.enabled}
            className={`q-${props.name}${props.value ? `-${props.value}` : ""}${(props.format?.[props.name] && (!props.value || props.format?.[props.name] === props.value)) ? " active" : ""}`}
            onClick={(evt) => {
                evt.preventDefault();
                return props.enabled && (props.handler(props.name, props.value) ?? false);
            }}
        >
            <SpriteIcon name={"ql-" + props.name + (props.value ? `-${props.value}` : "")} />
        </button>
    );
};

export default QuillGlobalToolbarButton;