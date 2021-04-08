import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";
import AnimateHeight from "react-animate-height";

import { isIPad13, isMobile, isTablet } from 'react-device-detect';
import { Subject } from "model/brick";

interface PublishedSubjectsProps {
  filterHeight: string;
  subjects: Subject[];
  filterBySubject(index: number): void;
  showUserCount?: boolean;
}

const MobileTheme = React.lazy(() => import('./themes/SubjectFilterMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/SubjectFilterTabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/SubjectFilterDesktopTheme'));

class SubjectsList extends Component<PublishedSubjectsProps, any> {
  render() {
    return (
      <React.Suspense fallback={<></>}>
        {isIPad13 || isTablet ? <TabletTheme /> : isMobile ? <MobileTheme /> : <DesktopTheme />}
        <Grid container direction="row" className="filter-container subjects-filter">
          <AnimateHeight
            duration={500}
            height={this.props.filterHeight}
            style={{ width: "100%" }}
          >
            {this.props.subjects.map((subject, i) => (
              <Grid key={i} container direction="row">
                <Grid item xs={11} className="filter-container subjects-indexes-box">
                  <FormControlLabel
                    className="index-box custom-color"
                    checked={subject.checked}
                    control={<Radio style={{ ["color" as any]: subject.color }} onClick={() => this.props.filterBySubject(i)} className={"filter-radio"} />}
                    label={subject.name}
                  />
                </Grid>
                <Grid item xs={1} className="published-count">
                  <Grid
                    container
                    alignContent="center"
                    justify="center"
                    style={{ height: "100%", margin: "0 0" }}
                  >
                    {this.props.showUserCount ? subject.userCount : subject.publishedBricksCount}
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </AnimateHeight>
        </Grid>
      </React.Suspense>
    );
  }
}

export default SubjectsList;
