import React from 'react';

import MathInHtml from 'components/play/baseComponents/MathInHtml';
import { stripHtml } from 'components/build/questionService/ConvertService';

interface AnswerProps {
  caption: string;
}

const CaptionText: React.FC<AnswerProps> = ({ caption }) => {
  const [realCaption, setCaption] = React.useState('');
  
  React.useEffect(() => {
    var data = stripHtml(caption);
    if (data.length > 0) {
      setCaption(data);
    }
  }, [caption]);

  return (
    <div className='image-caption-v4'>
      <div>
        <MathInHtml value={realCaption} />
      </div>
    </div>
  );
}

export default CaptionText;
