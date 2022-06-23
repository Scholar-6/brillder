import React, { Component } from "react";
import 'swiper/swiper.scss';

import MainPageMobile from "./MainPageMobile";
import MainPageDesktop from './MainPageDesktop';
import { isPhone } from "services/phone";
import { showZendesk } from "services/zendesk";
import { GetLoginRedirectUrl, UnsetLoginRedirectUrl } from "localStorage/login";
import { ClearAuthBrickCash, GetAuthBrickCash, GetUnauthBrickCash, ClearUnauthBrickCash } from "localStorage/play";
import routes from "components/play/routes";
import { Brick } from "model/brick";

interface MainPageProps {
  history: any;
}

class MainPage extends Component<MainPageProps> {
  constructor(props: MainPageProps) {
    super(props);
    const cashedDetails = GetAuthBrickCash();
    if (cashedDetails && cashedDetails.brick) {
      props.history.push(routes.playBrief(cashedDetails.brick as Brick));

      // competition brick cash is cleaning in play
      if (!cashedDetails.competitionId) {
        ClearAuthBrickCash();
      }
    } else {
      const cashedUnauthDetails = GetUnauthBrickCash();
      if (cashedUnauthDetails && cashedUnauthDetails.brick) {
        props.history.push(routes.playCover(cashedUnauthDetails.brick as Brick));
        ClearUnauthBrickCash();
      }
    }
  }

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
