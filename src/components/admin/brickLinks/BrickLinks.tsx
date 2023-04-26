import React, { Component } from "react";
import { History } from "history";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import './BrickLinks.scss';
import { User, } from "model/user";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import { adminGetBrickLinks } from "services/axios/admin";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BrickLinksSidebar from "./BrickLinksSidebar";


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
}

export interface HttpStatus {
  status: number;
  label: string;
  checked: boolean;
}

interface UsersState {
  isAscending: boolean;
  statuses: HttpStatus[];
  brickLinks: BrickLink[];
  finalLinks: BrickLink[];
}

class BrickLinksPage extends Component<UsersProps, UsersState> {
  constructor(props: UsersProps) {
    super(props);

    this.state = {
      isAscending: false,
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
      finalLinks: []
    };

    this.loadInitData();
  }

  filterAndSort(isAscending: boolean) {
    let finalLinks: any[] = [];

    let statuses = this.state.statuses.filter(s => s.checked).map(s => s.status);

    if (statuses.length === 0) {
      finalLinks = this.state.brickLinks;
    } else {
      finalLinks = this.state.brickLinks.filter(bl => statuses.find(s => bl.status === s) ? true : false)
    }

    return finalLinks;
  }

  async loadInitData() {
    const brickLinks = await adminGetBrickLinks();
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
          status = 'Forbiden';
        } else if (status === 404) {
          status = 'Not Found';
        }
        return (<div className="table-row" key={i}>
          <div className="index-column">{i + 1}</div>
          <div className="link-column">{bl.link}</div>
          <div className="status-column">{status}</div>
          <div className="brick-column">{bl.brickId}</div>
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
              <div>Index</div>
            </div>
            <div className="link-column header">
              <div>Link</div>
            </div>
            <div className="status-column header">
              <div>Status</div>
            </div>
            <div className="brick-column header">
              <div>BrickId</div>
              <div><SpriteIcon name="sort-arrows" onClick={() => {
                let isAscending = !this.state.isAscending;
                const finalLinks = this.filterAndSort(isAscending)
                this.setState({ isAscending, finalLinks });
              }} /></div>
            </div>
          </div>
          {this.renderBody()}
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

export default connect(mapState, mapDispatch)(BrickLinksPage);