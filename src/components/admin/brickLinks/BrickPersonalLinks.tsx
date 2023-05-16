import React, { Component } from "react";
import { History } from "history";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import './BrickLinks.scss';
import { User, } from "model/user";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import { adminGetPersonalBrickLinks } from "services/axios/admin";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BrickLinksSidebar from "./BrickLinksSidebar";
import { buildPlan, buildQuesiton, buildSynthesis } from "components/build/routes";
import { PlayLiveLastPrefix, PlayNewPrepLastPrefix, PlaySynthesisLastPrefix } from "components/play/routes";
import map, { playPreview } from "components/map";
import { getFormattedDate } from "components/services/brickService";

export enum DSortBy {
  Status,
  BrickId,
  Link,
  Updated
}

interface UsersProps {
  history: History;
  searchString: string;

  // redux
  user: User;
  requestFailed(e: string): void;
}

export interface BrickLink {
  id: number;
  brickId: number;
  status: number;
  link: string;
  position: string;
  datePublished: string;
}

enum ActiveTab {
  Links,
  Sources
}

export interface HttpStatus {
  status: number;
  label: string;
  checked: boolean;
}

interface UsersState {
  isAscending: boolean;
  activeTab: ActiveTab;
  sortBy: DSortBy;
  statuses: HttpStatus[];
  brickLinks: BrickLink[];
  finalLinks: BrickLink[];
}

class BrickPersonalLinksPage extends Component<UsersProps, UsersState> {
  constructor(props: UsersProps) {
    super(props);

    this.state = {
      isAscending: true,
      sortBy: DSortBy.Status,
      statuses: [{
        status: 200,
        label: 'Loaded',
        checked: false
      }, {
        status: 404,
        label: 'Not found',
        checked: false
      }, {
        status: 403,
        label: 'Forbidden',
        checked: false
      }],
      brickLinks: [],
      finalLinks: [],
      activeTab: ActiveTab.Links
    };

    this.loadInitData();
  }

  filterAndSort(isAscending: boolean, sortBy?: DSortBy) {
    let finalLinks: BrickLink[] = [];

    let statuses = this.state.statuses.filter(s => s.checked).map(s => s.status);

    if (statuses.length === 0) {
      finalLinks = this.state.brickLinks;
    } else {
      finalLinks = this.state.brickLinks.filter(bl => statuses.find(s => bl.status === s) ? true : false)
    }

    if (sortBy) {
      if (sortBy === DSortBy.BrickId) {
        if (!isAscending) {
          finalLinks.sort((a, b) => b.brickId - a.brickId);
        } else {
          finalLinks.sort((a, b) => a.brickId - b.brickId);
        }
      } else if (sortBy === DSortBy.Link) {
        if (!isAscending) {
          finalLinks.sort((a, b) => a.link.localeCompare(b.link));
        } else {
          finalLinks.sort((a, b) => b.link.localeCompare(a.link));
        }
      } else if (sortBy === DSortBy.Updated) {
        if (!isAscending) {
          finalLinks.sort((a, b) => new Date(a.datePublished).getTime() - new Date(b.datePublished).getTime());
        } else {
          finalLinks.sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime());
        }
      }
    }

    return finalLinks;
  }

  async loadInitData() {
    const brickLinks = await adminGetPersonalBrickLinks();
    if (brickLinks) {
      brickLinks.sort((a, b) => b.status - a.status);
      this.setState({ brickLinks, finalLinks: brickLinks });
    }
  }

  renderBody() {
    const { finalLinks } = this.state;
    if (finalLinks.length == 0) {
      return <div className="table-body">
        <div className="table-row">
          <div className="link-column">No Links</div>
        </div>
      </div>;
    }


    return <div className="table-body">
      {finalLinks.map((bl, i) => {
        let status: any = bl.status;
        if (status === 200) {
          status = 'Loaded';
        } else if (status === 403) {
          status = 'Forbidden';
        } else if (status === 404) {
          status = 'Not Found';
        }
        return (<div className="table-row" key={i}>
          <div className="index-column">{bl.datePublished && getFormattedDate(bl.datePublished)}</div>
          <div
            className="link-column link-real"
            onClick={() => {
              const a = document.createElement('a');
              a.target = "_blank";
              a.href = bl.link;
              a.click();
            }}
          >{bl.link}</div>
          <div className={`status-column ${(bl.status === 200 ? '' : 'text-orange')}`}>{status}</div>
          <div className="brick-column">
            <span>
              {bl.brickId}
            </span>

            <SpriteIcon name="link-to-build" onClick={() => {
              if (bl.position === 'brief' || bl.position === 'prep') {
                this.props.history.push(buildPlan(bl.brickId));
              } else if (bl.position === 'synthesis') {
                this.props.history.push(buildSynthesis(bl.brickId));
              } else if (bl.position.slice(0, 8) === 'question') {
                const qData = bl.position.split('_');
                this.props.history.push(buildQuesiton(bl.brickId) + '/' + qData[1]);
              }
            }} />
            <SpriteIcon name="link-to-view" onClick={() => {
              if (bl.position === 'brief' || bl.position === 'prep') {
                this.props.history.push(playPreview(bl.brickId) + PlayNewPrepLastPrefix);
              } else if (bl.position === 'synthesis') {
                this.props.history.push(playPreview(bl.brickId) + PlaySynthesisLastPrefix);
              } else if (bl.position.slice(0, 8) === 'question') {
                this.props.history.push(playPreview(bl.brickId) + PlayLiveLastPrefix);
              }
            }} />
          </div>
        </div>);
      })}
    </div>
  }

  renderTable() {
    return (
      <div className="table-container">
        <div className="table users-table-d34">
          <div className="table-head bold">
            <div className="index-column header">
              <div>Updated</div>
              <div><SpriteIcon name="sort-arrows" onClick={() => {
                let isAscending = !this.state.isAscending;
                const finalLinks = this.filterAndSort(isAscending, DSortBy.Updated)
                this.setState({ isAscending, finalLinks });
              }} /></div>
            </div>
            <div className="link-column header">
              <div>Link</div>
              <div><SpriteIcon name="sort-arrows" onClick={() => {
                let isAscending = !this.state.isAscending;
                const finalLinks = this.filterAndSort(isAscending, DSortBy.Link)
                this.setState({ isAscending, finalLinks });
              }} /></div>
            </div>
            <div className="status-column header">
              <div>Status</div>
            </div>
            <div className="brick-column header">
              <div>BrickId</div>
              <div><SpriteIcon name="sort-arrows" onClick={() => {
                let isAscending = !this.state.isAscending;
                const finalLinks = this.filterAndSort(isAscending, DSortBy.BrickId);
                this.setState({ isAscending, finalLinks });
              }} /></div>
            </div>
          </div>
          {this.renderBody()}
        </div>
      </div>
    );
  }

  linksTab() {
    return (
      <div className="no-active" onClick={() => this.props.history.push(map.BrickLinks)}>
        <div style={{ display: 'flex' }}>
          <span>Links</span>
        </div>
      </div>
    );
  }

  sourcesTab() {
    return (
      <div className="no-active" onClick={() => this.props.history.push(map.BrickSources)}>
        <div style={{ display: 'flex' }}>
          <span>Sources</span>
        </div>
      </div>
    );
  }

  personalLinksTab() {
    return (
      <div className="active">
        <div style={{ display: 'flex' }}>
          <span>Self-Published Links</span>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="main-listing bricks-played-page user-list-page manage-classrooms-page brick-links-page">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
          placeholder="Brick Title, Student Name, or Subject"
          user={this.props.user}
          history={this.props.history}
          search={() => { }}
          searching={() => { }}
        />
        <Grid container direction="row" className="sorted-row back-to-work-teach">
          <BrickLinksSidebar
            label="All Self-Published links"
            statuses={this.state.statuses}
            uncheckAll={() => {
              for (let status of this.state.statuses) {
                status.checked = false;
              }
              const finalLinks = this.filterAndSort(this.state.isAscending)
              this.setState({ statuses: [...this.state.statuses], finalLinks });
            }}
            toggleStatus={status => {
              status.checked = !status.checked;
              const finalLinks = this.filterAndSort(this.state.isAscending)
              this.setState({ statuses: [...this.state.statuses], finalLinks });
            }}
          />
          <Grid item xs={9} className="brick-row-container">
            <div className="tab-container">
              {this.linksTab()}
              {this.sourcesTab()}
              {this.personalLinksTab()}
            </div>
            <div className="tab-content">
              {this.renderTable()}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

export default connect(mapState, mapDispatch)(BrickPersonalLinksPage);