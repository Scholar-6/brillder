import React from 'react';

import { fileUrl } from 'components/services/uploadFile';

interface AnswerProps {
  fileName: string;
  imageCaption?: string;
}

const PairMatchImageContent: React.FC<AnswerProps> = ({ fileName, imageCaption }) => {
  const [imageHovered, setHover] = React.useState(false);
  const imageUrl = fileUrl(fileName);

  return (
    <div className="image-container">
      <img
        alt="" src={imageUrl} width="100%"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />
      {imageCaption && <div>{imageCaption}</div>}
      {imageHovered && <div className="center-fixed-image unselectable">
        <img alt="" src={imageUrl} />
      </div>}
    </div>
  );
}

export default PairMatchImageContent;
