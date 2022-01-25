import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import Checkbox from '@material-ui/core/Checkbox';
import queryString from 'query-string';
// @ts-ignore
import marked from "marked";

import map from "components/map";
import { isIPad13, isMobile, isTablet } from 'react-device-detect';
import { acceptTerms } from "services/axios/user";
import userActions from 'redux/actions/user';
import { getTerms } from "services/axios/terms";
import { isPhone } from "services/phone";
import { hideZendesk } from "services/zendesk";
import axios from "axios";
import { User } from "model/user";

interface BricksListProps {
  history: any;
  location: any;

  getUser(): Promise<any>;
}

interface Part {
  title: string;
  content: string;
  active: boolean;
  el: React.RefObject<HTMLDivElement>;
}

interface BricksListState {
  parts: Part[];
  accepted: boolean;
  lastModifiedDate: string;
}

const MobileTheme = React.lazy(() => import('./themes/TermsMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/TermsTabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/TermsDesktopTheme'));

class TermsSignUp extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props);
    console.log('init');

    this.state = {
      parts: [],
      accepted: false,
      lastModifiedDate: ''
    };

    this.getTerms();
  }

  componentDidMount() {
    if (isPhone()) {
      hideZendesk();
    }
  }

  async getTerms() {
    const r = await getTerms();
    if (r) {
      const partContents = r.data.split(/(?=\n# )/g);
      const parts = [];

      for (let partContent of partContents) {
        let part = {
          title: this.getTitle(partContent),
          active: false,
          content: partContent,
          el: React.createRef() as React.RefObject<HTMLDivElement>
        } as Part;
        parts.push(part);
      }

      this.setState({ parts, lastModifiedDate: r.lastModifiedDate });

      axios.get(
        `${process.env.REACT_APP_BACKEND_HOST}/user/current`,
        { withCredentials: true }
      ).then(response => {
        const { data } = response;
        console.log(data, r);
        if (r && r.lastModifiedDate == data.termsAndConditionsAcceptedVersion) {
          this.props.history.push(map.MainPage);
        }
      }).catch(error => {
        console.log('can`t get user for terms onboarding page')
      });

    }
  }

  getTitle(content: string) {
    let title = "";
    let res = content.split("\n");

    if (res[1].slice(0, 2) === "# ") {
      title = res[1].slice(2);
    }
    return title;
  }

  render() {
    return (
      <React.Suspense fallback={<></>}>
        {isIPad13 || isTablet ? <TabletTheme /> : isMobile ? <MobileTheme /> : <DesktopTheme />}
        <Grid
          className={`user-preference-page terms-page-container ${this.state.accepted ? 'terms-accepted' : ''}`}
          container direction="column"
          justify="center" alignItems="center"
        >
          <Grid className="user-preference-container terms-page-container onboarding-terms" item>
            <div className="terms-page">
              <div>
                {this.state.parts.map((p, i) => {
                  try {
                    console.log(i, p, p.content);
                    return <div key={i} ref={p.el} dangerouslySetInnerHTML={{ __html: marked(p.content) }} />
                  } catch (e) {
                    console.log('error', e);
                    return <div />;
                  }
                })}
              </div>
            </div>
            <div className="bottom-button" onClick={async () => {
              const success = await acceptTerms(this.state.lastModifiedDate);
              if (success) {
                this.setState({ accepted: true });
                const user = await this.props.getUser() as User;
                const values = queryString.parse(this.props.history.location.search);
                if (isPhone()) {
                  setTimeout(() => {
                    if (values.onlyAcceptTerms) {
                      this.props.history.push(map.MainPage);
                    } else {
                      this.props.history.push(map.ThankYouPage);
                    }
                  }, 1000);
                } else {
                  if (values.onlyAcceptTerms) {
                    this.props.history.push(map.MainPage);
                  } else {
                    if (user.userPreference?.preferenceId) {
                      this.props.history.push(map.MainPage);
                    } else {
                      this.props.history.push(map.UserPreferencePage);
                    }
                  }
                }
              }
            }}>
              <Checkbox color="secondary" />
              <span>I am over 13 years old, and agree to these Terms</span>
            </div>
          </Grid>
        </Grid>
      </React.Suspense>
    );
  }
}


const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});

export default connect(null, mapDispatch)(TermsSignUp);
