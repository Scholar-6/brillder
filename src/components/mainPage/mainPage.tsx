import React, { Component } from "react";
import { isIPad13, isMobile, isTablet } from "react-device-detect";
import 'swiper/swiper.scss';

import MainPageMobile from "./MainPageMobile";
import MainPageDesktop from './MainPageDesktop';

interface MainPageProps {
  history: any;
}

class MainPage extends Component<MainPageProps> {
  render() {
    if (isMobile && !(isTablet || isIPad13)) {
      return <MainPageMobile history={this.props.history} />
    }
    return <MainPageDesktop history={this.props.history} />
  }
}

export default MainPage;
