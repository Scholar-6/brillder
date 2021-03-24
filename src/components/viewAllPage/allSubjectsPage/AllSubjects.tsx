import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import queryString from 'query-string';
import "swiper/swiper.scss";
import { isIPad13, isMobile, isTablet } from 'react-device-detect';
import { User } from "model/user";
import { Subject, SubjectItem } from "model/brick";
import { getSubjects } from "services/axios/subject";
import map from "components/map";

import SubjectsColumn from "./components/SubjectsColumn";
import AllSubjectsSidebar from "./AllSubjectsSidebar";
import ViewAllFilter, { SortBy } from "../components/ViewAllFilter";
import UnauthorizedSidebar from "./components/UnauthrizedSidebar";


interface AllSubjectsProps {
  user: User;
  history: any;
  location: any;
  setViewAll(): void;
  filterByOneSubject(subjectId: number): void;
  checkSubjectsWithBricks(): void;
}

interface AllSubjectsState {
  subjects: SubjectItem[];
  totalSubjects: Subject[];
  activeSubject: SubjectItem;
  showFilters: boolean;
  searchString: string;
  isAllSubjects: boolean;
  failedRequest: boolean;
}

const MobileTheme = React.lazy(() => import('../themes/ViewAllPageMobileTheme'));
const TabletTheme = React.lazy(() => import('../themes/ViewAllPageTabletTheme'));
const DesktopTheme = React.lazy(() => import('../themes/ViewAllPageDesktopTheme'));

class AllSubjectsPage extends Component<AllSubjectsProps, AllSubjectsState> {
  constructor(props: AllSubjectsProps) {
    super(props);

    let showFilters = false;
    const values = queryString.parse(props.location.search);
    if (values.filter) {
      showFilters = true;
    }

    this.state = {
      subjects: [],
      totalSubjects: [],
      activeSubject: {} as SubjectItem,
      failedRequest: false,
      searchString: '',
      isAllSubjects: true,
      showFilters
    };

    this.loadSubjects();
  }

  async loadSubjects() {
    let subjects = await getSubjects() as SubjectItem[] | null;

    if (subjects) {
      subjects.sort((s1, s2) => s1.name.localeCompare(s2.name));
      this.setState({ ...this.state, subjects, totalSubjects: subjects });
    } else {
      this.setState({ ...this.state, failedRequest: true });
    }
    return subjects;
  }


  onSubjectSelected(subjectId: number) {
    const { subjects } = this.state;
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      this.props.filterByOneSubject(subject.id);
      this.props.history.push(map.ViewAllPage + `?subjectId=${subject.id}`);
    }
  }

  isFilterClear() {
    return this.state.subjects.some(r => r.checked);
  }

  render() {
    return (
      <React.Suspense fallback={<></>}>
        {isIPad13 || isTablet ? <TabletTheme /> : isMobile ? <MobileTheme /> : <DesktopTheme />}
        <Grid container direction="row" className="sorted-row dashboard-all-subjects">
          {this.state.showFilters ?
            <ViewAllFilter
              user={this.props.user}
              sortBy={SortBy.Date}
              subjects={this.state.subjects}
              userSubjects={this.props.user ? this.props.user.subjects : []}
              isCore={true}
              isClearFilter={this.isFilterClear()}
              isAllSubjects={this.state.isAllSubjects}
              setAllSubjects={isAllSubjects => this.setState({ isAllSubjects })}
              handleSortChange={() => { }}
              isViewAll={false}
              selectAllSubjects={() => {}}
              clearSubjects={() => { }}
              filterBySubject={id => this.onSubjectSelected(id)}
            />
            : this.props.user ? <AllSubjectsSidebar /> : <UnauthorizedSidebar />
          }
          <Grid item xs={9} className="brick-row-container view-all-subjects">
            <SubjectsColumn
              subjects={this.state.totalSubjects}
              viewAll={() => {
                this.props.checkSubjectsWithBricks();
                this.props.setViewAll();
                this.props.history.push(map.ViewAllPage + `?isViewAll=${true}`);
              }}
              onClick={this.onSubjectSelected.bind(this)}
            />
          </Grid>
        </Grid>
      </React.Suspense>
    );
  }
}

export default AllSubjectsPage;
