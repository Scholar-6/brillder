import React, { Component } from "react";
import 'swiper/swiper.scss';

import MainPageMobile from "./MainPageMobile";
import MainPageDesktop from './MainPageDesktop';
import { isPhone } from "services/phone";

interface MainPageProps {
  history: any;
}

class MainPage extends Component<MainPageProps> {
  render() {
    if (isPhone()) {
      return <MainPageMobile history={this.props.history} />
    }
    return <MainPageDesktop history={this.props.history} />
  }
}

export default MainPage;
