import React, { Component } from "react";
import 'swiper/swiper.scss';

import MainPageMobile from "./MainPageMobile";
import MainPageDesktop from './MainPageDesktop';
import { isPhone } from "services/phone";
import { showZendesk } from "services/zendesk";
import { GetLoginRedirectUrl, UnsetLoginRedirectUrl } from "localStorage/login";

interface MainPageProps {
  history: any;
}

class MainPage extends Component<MainPageProps> {
  componentDidMount() {
    const redirectUrl = GetLoginRedirectUrl();
    if (redirectUrl) {
      UnsetLoginRedirectUrl();
      this.props.history.push(redirectUrl);
    }

    if (isPhone()) {
      showZendesk();
    }
  }

  render() {
    if (isPhone()) {
      return <MainPageMobile history={this.props.history} />
    }
    return <MainPageDesktop history={this.props.history} />
  }
}

export default MainPage;
