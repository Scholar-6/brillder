import { generateId } from 'components/build/buildQuestions/questionTypes/service/questionBuild';
import React from 'react';
import SpriteIcon from '../SpriteIcon';

interface QuillToolbarAlignSelectProps {
  name: string;
  label?: string;

  enabled?: boolean;
  handler(name: string, value?: string): boolean | undefined;
  format?: any;
}

const QuillToolbarAlignSelect: React.FC<QuillToolbarAlignSelectProps> = props => {
  const [uniqueId] = React.useState(generateId());
  const [expanded, setExpanded] = React.useState(false);

  const getItem = (node: React.ReactElement) => {
    const name = node.props.children;
    const value = node.props.value;
    return <span className="ql-picker-item ql-primary" data-label={name} data-value={value} onClick={() => props.handler(props.name, value) ?? false}>
      <SpriteIcon name={`ql-${props.name}-${value}`} />
    </span>;
  }

  return (
    <span
      className={`picker q-tooltip-hover q-${props.name}${expanded ? " ql-expanded" : ""}${props.enabled ? "" : " disabled"}`}
      onClick={() => props.enabled && setExpanded(e => !e)}
    >
      <span className="picker-label">
        <SpriteIcon name={`ql-${props.name}-${props.format?.[props.name] ?? "left"}`} />
      </span>
      <span id={`picker-options-${uniqueId}`} className="picker-options q-align">
        {props.children && React.Children.map(props.children as any, getItem)}
      </span>
      {props.enabled && <div className="css-custom-tooltip">{props.label || props.name}</div>}
    </span>
  );
};

export default QuillToolbarAlignSelect;