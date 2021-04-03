import React, { Component } from 'react';
import './pageLoader.scss';
import LoaderLogo from 'assets/img/dot-loader.svg';
class PageLoader extends Component<pageLoaderProps> {
  render() {
    //let { content } = this.props
    return (
      <div className="page-loader">
        <img src={LoaderLogo} alt={this.props.content} />
        {/* <span>{content}</span> */}
      </div>
    );
  }
}
interface pageLoaderProps {
  content: string;
}
export default PageLoader;
