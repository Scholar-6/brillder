import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import queryString from 'query-string';
import "swiper/swiper.scss";
import { isIPad13, isMobile, isTablet } from 'react-device-detect';
import { User } from "model/user";
import { Subject, SubjectItem } from "model/brick";
import { getSubjects } from "services/axios/subject";
import map from "components/map";
import SubjectCategoriesSidebar from "./SubjectCategoriesSidebar";


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

const MobileTheme = React.lazy(() => import('./themes/SCategorisMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/SCategorisTabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/SCategorisDesktopTheme'));

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
      let link = map.ViewAllPage + `?subjectId=${subject.id}`;

      const values = queryString.parse(this.props.location.search);
      if (values.newTeacher) {
        link += '&' + map.NewTeachQuery;
      }
      this.props.history.push(link);
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
          <SubjectCategoriesSidebar />
          <Grid item xs={9} className="brick-row-container view-all-subjects subject-categories">
            <div className="row">
              <div>
                <svg viewBox="0 0 60 60">
                  <circle cx="23" cy="25" r="10" fill="#3E93FC"></circle>
                  <circle cx="37" cy="25" r="10" fill="#BFC86D"></circle>
                </svg>
                <div className="cat-name">Arts</div>
              </div>
              <div>
                <svg viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="10" fill="#C6B5C0"></circle>
                </svg>
                <div className="cat-name">Ceteral & Topical</div>
              </div>
              <div>
                <svg viewBox="0 0 60 60">
                  <circle cx="27" cy="33" r="10" fill="#B2FC89"></circle>
                  <circle cx="24" cy="30" r="10" fill="#B061FF"></circle>
                  <circle cx="24" cy="27" r="10" fill="#905640"></circle>
                  <circle cx="28" cy="25" r="10" fill="#E1C58F"></circle>
                  <circle cx="33" cy="25" r="10" fill="#B8B8B8"></circle>
                  <circle cx="33" cy="33" r="10" fill="#D057D9"></circle>
                  <circle cx="32" cy="34" r="10" fill="#D5D0B6"></circle>
                  <circle cx="29" cy="36" r="10" fill="#857E7D"></circle>
                </svg>
                <div className="cat-name">Humanities & Social Sciences</div>
              </div>
            </div>
            <div className="row">
              <div>
                <svg viewBox="0 0 50 50">
                  <circle cx="30" cy="18" r="10" fill="#D42B25"></circle>
                  <circle cx="23" cy="30" r="10" fill="#FF82D8"></circle>
                  <circle cx="37" cy="30" r="10" fill="#FFF058"></circle>
                </svg>
                <div className="cat-name">Languages</div>
              </div>
              <div>
                <svg viewBox="0 0 40 30" className="two-circles">
                  <circle cx="13" cy="15" r="10" fill="#FF5A00"></circle>
                  <circle cx="27" cy="15" r="10" fill="#ABF7CF"></circle>
                </svg>
                <div className="cat-name">Maths and Computing</div>
              </div>
              <div>
                <svg viewBox="0 0 50 50">
                  <circle cx="30" cy="18" r="10" fill="#68D462"></circle>
                  <circle cx="23" cy="30" r="10" fill="#72E1D2"></circle>
                  <circle cx="37" cy="30" r="10" fill="#FFAE00"></circle>
                </svg>
                <div className="cat-name">Science</div>
              </div>
            </div>
          </Grid>
        </Grid>
      </React.Suspense>
    );
  }
}

export default AllSubjectsPage;
