import React from 'react';
import SpriteIcon from './SpriteIcon';

interface SourceInputProps {
  source: string;
  validationRequired: boolean;
  setSource(v: string): void;
}

const SourceInput: React.FC<SourceInputProps> = ({ source, validationRequired, setSource }) => {
  return (
    <div className="source-input">
      <div className="fixed-icon">
        <SpriteIcon name="link" />
      </div>
      <input
        value={source}
        className={validationRequired && !source ? "invalid" : ""}
        onChange={(e) => setSource(e.target.value)}
        placeholder="Add link to source or name of owner"
      />
    </div>
  );
}

export default SourceInput;
