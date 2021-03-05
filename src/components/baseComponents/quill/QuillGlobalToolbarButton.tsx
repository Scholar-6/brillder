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
            className={`ql-${props.name}${props.format?.[props.name] ? " active" : ""}`}
            onClick={() => props.handler(props.name, props.value) ?? false}
        >
            <SpriteIcon name={props.name} />
        </button>
    );
};

export default QuillGlobalToolbarButton;