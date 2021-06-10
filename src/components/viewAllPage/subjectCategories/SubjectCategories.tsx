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

  moveToArt() {
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
                <div onClick={this.moveToArt}>
                  <div className="flex-center">
                    <img alt="" src="/images/subject-categories/canvas.svg" />
                  </div>
                  <div className="cat-name">Arts</div>
                </div>
              </div>
              <div>
                <div onClick={() => {}}>
                  <div className="flex-center">
                    <img alt="" src="/images/subject-categories/internet.svg" />
                  </div>
                  <div className="cat-name">Ceteral & Topical</div>
                </div>
              </div>
              <div>
                <div onClick={() => {}}>
                  <div className="flex-center">
                    <img alt="" src="/images/subject-categories/book.svg" />
                  </div>
                  <div className="cat-name">Humanities & Social Sciences</div>
                </div>
              </div>
              <div>
                <div onClick={() => {}}>
                  <div className="flex-center">
                    <img alt="" src="/images/subject-categories/education.svg" />
                  </div>
                  <div className="cat-name">School Client</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div>
                <div onClick={() => {}}>
                  <div className="flex-center">
                    <img alt="" src="/images/subject-categories/translating.svg" />
                  </div>
                  <div className="cat-name">Languages</div>
                </div>
              </div>
              <div>
                <div onClick={() => {}}>
                  <div className="flex-center">
                    <img alt="" src="/images/subject-categories/binary-code.svg" />
                  </div>
                  <div className="cat-name">Maths and Computing</div>
                </div>
              </div>
              <div>
                <div onClick={() => {}}>
                  <div className="flex-center">
                    <img alt="" src="/images/subject-categories/chemistry.svg" />
                  </div>
                  <div className="cat-name">Science</div>
                </div>
              </div>
              <div>
                <div onClick={() => {}}>
                  <div className="flex-center">
                    <img alt="" src="/images/subject-categories/economics.svg" />
                  </div>
                  <div className="cat-name">Corporate</div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </React.Suspense>
    );
  }
}

export default AllSubjectsPage;
