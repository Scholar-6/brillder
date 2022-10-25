import React, { Component } from "react";
import { Grid } from "@material-ui/core";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import RadioButton from "components/baseComponents/buttons/RadioButton";
import { User } from "model/user";


interface Filters {
  
}


interface FilterSidebarProps {
  isLoaded: boolean;
  filterChanged(filters: Filters): void;
}

interface FilterSidebarState {
  filters: Filters;
}

export enum SortClassroom {
  Name,
  Date,
  Assignment
}

class BricksPlayedSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  constructor(props: FilterSidebarProps) {
    super(props);
    this.state = {
      filters: {
        assigned: false,
        completed: false,
      },
    };
  }

  render() {
    return (
      <Grid
        container item xs={3}
        className="sort-and-filter-container teach-assigned"
      >
        <div className="sort-box">
          <div className="bold font1-5">Admin Data Dashboard</div>
        </div>
        <div className="sidebar-footer" />
      </Grid>
    );
  }
}

export default BricksPlayedSidebar;
