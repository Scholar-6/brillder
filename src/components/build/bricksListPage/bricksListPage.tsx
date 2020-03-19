import './bricksListPage.scss';
import React, { Component } from 'react';
import { Box, Grid, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// @ts-ignore
import { connect } from 'react-redux';

import actions from 'redux/actions/bricksActions';
import { Brick } from 'model/brick';

const mapState = (state: any) => {
  return {
    bricks: state.bricks.bricks
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    fetchBricks: () => dispatch(actions.fetchBricks()),
  }
}

const connector = connect(mapState, mapDispatch);

interface BricksListProps {
  bricks: Array<Brick>;
  fetchBricks(): void;
  history: any;
}

interface BricksListState {
  bricks: Array<Brick>;
  sortBy: SortBy;
}

enum SortBy {
  None,
  Date,
  Subject,
  Popularity,
  Author,
  Length,
}

class BricksListPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props)
    this.props.fetchBricks();
    this.state = {bricks: props.bricks, sortBy: SortBy.None};
  }

  componentWillReceiveProps(props:BricksListProps) {
    this.setState({bricks: props.bricks});
  }

  move(brickId:number) {
    this.props.history.push(`/build/brick/${brickId}/build/investigation/question`)
  }

  expend(brick: Brick) {
    brick.expanded = !brick.expanded;
    this.setState({ bricks: this.state.bricks });
  }

  createBricksList = () => {
    let bricksList = []
    let i = 0;
    for (let brick of this.state.bricks) {
      bricksList.push(
        <Grid container key={i} item xs={12} sm={6} md={4} lg={3} justify="center">
          <div className="main-brick-container">
            <Box className={brick.expanded ? "expanded brick-container" : "brick-container"} style={{paddingRight: 0}} onClick={() => this.expend(brick)}>
              <Grid container direction="row" style={{padding: 0}}>
              <Grid item xs={11}>
                <div className="link-description">{brick.title}</div>
                <div className="link-info">{brick.subTopic} | {brick.alternativeTopics}</div>
                <div className="link-info">{brick.author?.firstName} {brick.author?.lastName} | DD.MM.YYYY | {brick.brickLength} mins</div>
                {
                  brick.expanded
                    ?
                      <div className="edit-button" onClick={() => this.move(brick.id)}>EDIT</div>
                    : ""
                }
                </Grid>
                <Grid className="right-color-column" style={{background: "green"}} item xs={1}>
                  <Grid container alignContent="flex-end" style={{width: '100%', height: '100%'}} justify="center">
                    {
                      brick.expanded ? "-" : "+"
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </div>
        </Grid>
      );
      i++;
    }
    return bricksList
  }

  render() {  
    return (
      <div className="bricks-list-page">
        <div className="bricks-upper-part">
          <h1>A &nbsp;L &nbsp;L&nbsp; &nbsp; B &nbsp;R &nbsp;I&nbsp; C&nbsp; K&nbsp; S</h1>
          <div className="bricks-sort">
            <Grid container direction="row" className="sort-and-search-row">
              <Grid container item xs={3} justify="flex-start">
                <FormControl className="search-brick">
                  <InputLabel className="search-label">Search</InputLabel>
                  <OutlinedInput
                    className="search-input"
                    endAdornment={
                      <InputAdornment position="end">
                        <SearchIcon className="search-icon" />
                      </InputAdornment>
                    }
                    labelWidth={70}
                  />
                </FormControl>
              </Grid>
              <Grid container item xs={9} justify="flex-start">
                <Grid container item xs={2} justify="flex-start"></Grid>
                <Grid container item xs={10} justify="flex-start">
                  <div style={{ width: "100%" }}>
                    <Grid container item xs={12} className="sort-bricks-by">
                      <span className="sort-by">Sort by</span>
                      <span className="sort-element">D A T E</span>
                      <ExpandMoreIcon className="expanded-icon" />
                      <span className="sort-element">S U B J E C T</span>
                      <ExpandMoreIcon className="expanded-icon" />
                      <span className="sort-element">P O P U L A R I T Y</span>
                      <ExpandMoreIcon className="expanded-icon" />
                      <span className="sort-element">A U T H O R</span>
                      <ExpandMoreIcon className="expanded-icon" />
                      <span className="sort-element">L E N G T H</span>
                      <ExpandMoreIcon className="expanded-icon" />
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <div className="bricks-list">
            <Grid container direction="row">
              {this.createBricksList()}
            </Grid>
          </div>
        </div>
        <div className="brick-list-footer">
          fotter
        </div>
      </div>
    )
  }
}

export default connector(BricksListPage);
