import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import Checkbox from '@material-ui/core/Checkbox';
import axios from "axios";
// @ts-ignore
import marked from "marked";

import "./Terms.scss";
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";
import map from "components/map";

interface BricksListProps {
  user: User;
  history: any;
  location: any;
}

interface Part {
  title: string;
  content: string;
  active: boolean;
  el: React.RefObject<HTMLDivElement>;
}

interface BricksListState {
  parts: Part[];
}

class TermsPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props);

    this.state = {
      parts: [],
    };

    axios.get("/terms.md").then((r) => {
      if (r.data) {
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

        this.setState({ parts });
      }
    });
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
      <Grid
        className="user-preference-page"
        container direction="column"
        justify="center" alignItems="center"
      >
        <Grid className="user-preference-container terms-page-container" item>
          <div className="terms-page">
            <div>
              {this.state.parts.map((p) => (
                <div ref={p.el} dangerouslySetInnerHTML={{ __html: marked(p.content) }} />
              ))}
            </div>
          </div>
          <div className="bottom-button" onClick={() => this.props.history.push(map.SetUsername)}>
            <Checkbox color="secondary" />
            <span>
              I am over 13 years old, and agree to the Brillder Terms of Service and Privacy Policy
            </span>
          </div>
        </Grid>
      </Grid>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

export default connect(mapState)(TermsPage);
