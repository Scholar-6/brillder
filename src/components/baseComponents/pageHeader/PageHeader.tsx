import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import sprite from "../../../assets/img/icons-sprite.svg";
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import './PageHeader.scss';


interface UsersListProps {
  searchPlaceholder: string;
  search(): void;
  searching(value: string): void;
  showDropdown(): void;
}


class PageHeader extends Component<UsersListProps> {
  keySearch(e: any) {
    if (e.keyCode === 13) {
      this.props.search();
    }
  }

  render() {
    return (
      <Grid container direction="row" className="page-header">
        <HomeButton link="/build" />
        <Grid container className="logout-container" item direction="row" style={{width: '92.35vw'}}>
          <Grid container style={{width: '60vw', height: '7vh'}}>
            <Grid item>
              <div className="search-button" onClick={() => this.props.search()}></div>
            </Grid>
            <Grid item>
              <input
                className="search-input"
                onKeyUp={(e) => this.keySearch(e)}
                onChange={(e) => this.props.searching(e.target.value)}
                placeholder={this.props.searchPlaceholder}
              />
            </Grid>
          </Grid>
          <Grid item style={{width: '32.35vw'}}>
            <Grid container direction="row" justify="flex-end">
              <div className="bell-button svgOnHover">
								<svg className="svg svg-default">
									<use href={sprite + "#bell-empty"}/>
								</svg>
								<svg className="svg colored">
									<use href={sprite + "#bell-filled"}/>
								</svg>
							</div>
              <div className="more-button svgOnHover" onClick={() => this.props.showDropdown()}>
								<svg className="svg svg-default">
									<use href={sprite + "#more-hor-3"}/>
								</svg>
								<svg className="svg colored">
									<use href={sprite + "#more-hor-6"}/>
								</svg>
							</div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default PageHeader;
