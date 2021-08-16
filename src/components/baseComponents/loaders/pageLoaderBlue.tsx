import React from 'react';

import './pageLoader.scss';
import SpriteIcon from '../SpriteIcon';

interface PageLoaderProps {
  content: string;
}

const PageLoaderBlue: React.FC<PageLoaderProps> = () => {
  return (
    <div className="page-loader">
      <SpriteIcon name="f-loader" className="spinning blue" />
    </div>
  );
}

export default PageLoaderBlue;
