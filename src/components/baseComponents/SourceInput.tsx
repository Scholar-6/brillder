import React from 'react';
import SpriteIcon from './SpriteIcon';
import { stripHtmlAndGetLink } from 'components/build/questionService/ConvertService';

interface SourceInputProps {
  source: string;
  validationRequired: boolean;
  setSource(v: string): void;
}

const SourceInput: React.FC<SourceInputProps> = ({ source, validationRequired, setSource }) => {
  const validate = () => {
    if (validationRequired) {
      if (source && source.trim().length > 0) {
        return '';
      }
      return 'invalid';
    }
    return '';
  }
  return (
    <div className="source-input source-sound-33">
      <div className="fixed-icon">
        <SpriteIcon name="link" />
      </div>
      <input
        value={source}
        className={validate()}
        onChange={(e) => {
          // check if html
          let value = e.target.value;
          let isLink = value.indexOf('<a href=') >= 0;
          if (isLink) {
            try {
              value = stripHtmlAndGetLink(value);
            } catch {}
          }
          setSource(value)}
        }
        placeholder="Add link to source or name of owner"
      />
    </div>
  );
}

export default SourceInput;
