import React, { Component } from 'react';

import './pageLoader.scss';
import LoaderLogo from 'assets/img/dot-loader-blue.svg';

class PageLoaderBlue extends Component<pageLoaderProps> {
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
export default PageLoaderBlue;
