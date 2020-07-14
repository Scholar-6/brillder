import React, { Component } from 'react';
import './pageLoader.scss';
import ReactLogo from '../../../assets/img/dot-loader.svg';
class PageLoader extends Component<pageLoaderProps> {
  render() {
    let { content } = this.props
    return (
      <div className="page-loader">
        {/* <img src="/assets/img/dot-loader.svg" alt="" /> */}
        <img src={ReactLogo} alt="React Logo" />
        <span>{content}</span>
      </div>
    );
  }
}
interface pageLoaderProps {
  content: string;
}
export default PageLoader;
