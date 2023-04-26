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

interface UsersState {
  brickLinks: BrickLink[];
}

class BrickLinksPage extends Component<UsersProps, UsersState> {
  constructor(props: UsersProps) {
    super(props);

    this.state = {
      brickLinks: [],
    };

    this.loadInitData();
  }

  async loadInitData() {
    const brickLinks = await adminGetBrickLinks();
    if (brickLinks) {
      brickLinks.sort((a,b) => b.status - a.status);
      this.setState({ brickLinks });
    }
  }

  renderBody() {
    const { brickLinks } = this.state;
    if (brickLinks.length == 0) {
      return <div className="table-body">
        <div className="table-row">
          <div className="link-column">No Links</div>
        </div>
      </div>;
    }
    

    return <div className="table-body">
      {brickLinks.map((bl, i) => {
        let status:any = bl.status;
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
          <div className="brick-column">{bl.brickId}</div>
          <div className="status-column">{status}</div>
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
            <div className="brick-column header">
              <div>BrickId</div>
            </div>
            <div className="status-column header">
              <div>Status</div>
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
          <Grid container item xs={3} className="sort-and-filter-container teach-assigned">
            <div className="sort-box">
              <div className="bold font1-5">Links of all Bricks</div>
            </div>
            <div className="sidebar-footer" />
          </Grid>
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