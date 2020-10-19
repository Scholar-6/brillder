import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { Brick, Subject } from "model/brick";

interface SubjectItem extends Subject {
  count: number;
}

interface FilterSidebarProps {
  bricks: Brick[];
}

interface FilterSidebarState {
}

class FilterSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  renderIndexesBox(subjects: SubjectItem[]) {
    return (
      <div className="sort-box">
        <div className="filter-container sort-by-box">
          <div className="sort-header">INBOX</div>
        </div>
        <div className="filter-container indexes-box">
          <div className={"index-box " + (true ? "active" : "")} onClick={()=>{}}>
            View All
            <div className="right-index">{this.props.bricks.length}</div>
          </div>
        </div>
      </div>
    );
  }

  renderSortAndFilterBox = () => {
    return (
      <div className="sort-box">
        <div className="filter-header" style={{marginTop: '5vh', marginBottom: '3vh'}}>
          <span>FILTER</span>
        </div>
      </div>
    );
  };

  render() {
    let subjects:SubjectItem[] = [];
    for (let brick of this.props.bricks) {
      let subject = subjects.find(s => s.id === brick.subject?.id);
      if (!subject) {
        let subject = Object.assign({}, brick.subject) as SubjectItem;
        subject.count = 1;
        subjects.push(subject);
      } else {
        subject.count += 1;
      }
    }
    return (
      <Grid container item xs={3} className="sort-and-filter-container">
        {this.renderIndexesBox(subjects)}
        {this.renderSortAndFilterBox()}
      </Grid>
    );
  }
}

export default FilterSidebar;
