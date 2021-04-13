import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import axios from "axios";
// @ts-ignore
import marked from "marked";

import "./PublicTerms.scss";
import { User } from "model/user";
import { ReduxCombinedState } from "redux/reducers";

import PageHeadWithMenu, {
  PageEnum,
} from "components/baseComponents/pageHeader/PageHeadWithMenu";

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

  moveTo(p: Part) {
    for (let p of this.state.parts) {
      p.active = false;
    }
    p.active = true;
    if (p.el.current) {
      p.el.current.scrollIntoView({
        behavior: "smooth"
      });
    }
    this.setState({ ...this.state });
  }

  render() {
    return (
      <div className="main-listing dashboard-page public-terms-page">
        <PageHeadWithMenu
          page={PageEnum.ViewAll}
          user={this.props.user}
          placeholder={"Search Subjects, Topics, Titles & more"}
          history={this.props.history}
          search={() => { }}
          searching={(v) => { }}
        />
        <Grid container direction="row" className="sorted-row">
          <Grid container item xs={3} className="sort-and-filter-container">
            {this.state.parts.map((p) => {
              if (p.title) {
                return (
                  <div
                    className={`header-link ${p.active ? "bold active" : ""}`}
                    onClick={() => this.moveTo(p)}
                  >
                    <div className="white-circle" />{p.title}
                  </div>);
              } else {
                return <div />;
              }
            })}
          </Grid>
          <Grid item xs={9} className="brick-row-container">
            <div className="bricks-list-container bricks-container-mobile terms-and-conditions">
              {this.state.parts.map((p) => (
                <div ref={p.el} dangerouslySetInnerHTML={{ __html: marked(p.content) }} />
              ))}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

export default connect(mapState)(TermsPage);
