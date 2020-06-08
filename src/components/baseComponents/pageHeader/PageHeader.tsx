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
        <Grid container className="logout-container"  style={{width: '92.35vw'}}>
          <Grid container style={{width: '60vw'}} direction="row">
            <Grid item>
              <div className="search-button svgOnHover" onClick={() => this.props.search()}>
								<svg className="svg svg-default">
									<use href={sprite + "#search-thin"}/>
								</svg>
								<svg className="svg colored">
									<use href={sprite + "#search-thick"}/>
								</svg>
							</div>
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
          <Grid container style={{width: '32.35vw'}} direction="row" justify="flex-end">
            <Grid item>
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
									<use href={sprite + "#more-thin"}/>
								</svg>
								<svg className="svg colored">
									<use href={sprite + "#more-thick"}/>
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
