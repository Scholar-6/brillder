import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import queryString from 'query-string';
import "swiper/swiper.scss";

import "../ViewAll.scss";
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
  filterByOneSubject(subjectId: number): void;
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
      this.props.history.push(map.ViewAllPage + `?subjectId=${subject.id}`);
      this.props.filterByOneSubject(subject.id);
    }
  }

  render() {
    return (
      <Grid container direction="row" className="sorted-row">
        {this.state.showFilters ?
          <ViewAllFilter
            user={this.props.user}
            sortBy={SortBy.Date}
            subjects={this.state.subjects}
            userSubjects={this.props.user ? this.props.user.subjects : []}
            isCore={true}
            isClearFilter={() => { }}
            isAllSubjects={this.state.isAllSubjects}
            setAllSubjects={isAllSubjects => this.setState({ isAllSubjects })}
            handleSortChange={() => { }}
            clearSubjects={() => { }}
            filterBySubject={id => this.onSubjectSelected(id)}
          />
          : this.props.user ? <AllSubjectsSidebar /> : <UnauthorizedSidebar />
        }
        <Grid item xs={9} className="brick-row-container">
          <SubjectsColumn
            subjects={this.state.totalSubjects}
            viewAll={() => this.props.history.push(map.ViewAllPage + `?isViewAll=${true}`)}
            onClick={this.onSubjectSelected.bind(this)}
          />
        </Grid>
      </Grid>
    );
  }
}

export default AllSubjectsPage;
