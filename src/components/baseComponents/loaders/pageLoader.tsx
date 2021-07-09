import React, { Component } from 'react';

import './pageLoader.scss';
import LoaderLogo from 'assets/img/dot-loader.svg';

class PageLoader extends Component<pageLoaderProps> {
  render() {
    return (
      <div className="page-loader">
        <img src={LoaderLogo} alt="Loader logo" />
      </div>
    );
  }
}
interface pageLoaderProps {
  content: string;
}
export default PageLoader;
