import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import queryString from 'query-string';
import "swiper/swiper.scss";
import { isMobile } from 'react-device-detect';
import { User } from "model/user";
import { Subject, SubjectGroup } from "model/brick";
import map from "components/map";
import SubjectCategoriesSidebar from "./SubjectCategoriesSidebar";
import { isPhone } from "services/phone";

interface AllSubjectsProps {
  user: User;
  subjects: Subject[];
  history: any;
  location: any;
  setViewAll(): void;
  setSubjectGroup(sGroup: SubjectGroup): void;
  filterByOneSubject(subjectId: number): void;
  checkSubjectsWithBricks(): void;
}

interface AllSubjectsState {
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
      failedRequest: false,
      searchString: '',
      isAllSubjects: true,
      showFilters
    };
  }

  moveToGroup(sGroup: SubjectGroup) {
    this.props.setSubjectGroup(sGroup);
    this.props.history.push(map.ViewAllPage + '?subjectGroup=' + sGroup);
  }

  render() {
    if (isPhone()) {
      return (
        <React.Suspense fallback={<></>}>
          <MobileTheme />
          <div className="phone-subject-category">
            <div className="title-lines">
              <div>Click to explore one of the</div>
              <div> following subject categories.</div>
            </div>
            <div className="subject-category">
              <div onClick={() => this.moveToGroup(SubjectGroup.Arts)}>
                <div className="flex-center">
                  <img alt="" src="/images/subject-categories/canvas.svg" />
                </div>
                <div className="cat-name">Arts</div>
              </div>
            </div>
            <div className="subject-category">
              <div onClick={() => this.moveToGroup(SubjectGroup.GeneralTopical)}>
                <div className="flex-center">
                  <img alt="" src="/images/subject-categories/internet.svg" />
                </div>
                <div className="cat-name">Ceteral & Topical</div>
              </div>
            </div>
            <div className="subject-category">
              <div onClick={() => this.moveToGroup(SubjectGroup.HumanitiesAndSocialSciences)}>
                <div className="flex-center">
                  <img alt="" src="/images/subject-categories/book.svg" />
                </div>
                <div className="cat-name">Humanities & Social Sciences</div>
              </div>
            </div>
            <div className="subject-category">
              <div onClick={() => this.moveToGroup(SubjectGroup.Languages)}>
                <div className="flex-center">
                  <img alt="" src="/images/subject-categories/translating.svg" />
                </div>
                <div className="cat-name">Languages</div>
              </div>
            </div>
            <div className="subject-category">
              <div onClick={() => this.moveToGroup(SubjectGroup.MathsAndComputing)}>
                <div className="flex-center">
                  <img alt="" src="/images/subject-categories/binary-code.svg" />
                </div>
                <div className="cat-name">Maths and Computing</div>
              </div>
            </div>
            <div className="subject-category">
              <div onClick={() => this.moveToGroup(SubjectGroup.Science)}>
                <div className="flex-center">
                  <img alt="" src="/images/subject-categories/chemistry.svg" />
                </div>
                <div className="cat-name">Science</div>
              </div>
            </div>
            <div className="subject-category">
              <div onClick={() => { }}>
                <div className="flex-center">
                  <img alt="" src="/images/subject-categories/education.svg" />
                </div>
                <div className="cat-name">School Client</div>
              </div>
            </div>
            <div className="subject-category">
              <div onClick={() => { }}>
                <div className="flex-center">
                  <img alt="" src="/images/subject-categories/economics.svg" />
                </div>
                <div className="cat-name">Corporate</div>
              </div>
            </div>
          </div>
        </React.Suspense>
      );
    }
    return (
      <React.Suspense fallback={<></>}>
        {isMobile ? <TabletTheme /> : <DesktopTheme />}
        <Grid container direction="row" className="sorted-row dashboard-all-subjects">
          <SubjectCategoriesSidebar />
          <Grid item xs={9} className="brick-row-container view-all-subjects subject-categories">
            <div className="row">
              <div>
                <div onClick={() => this.moveToGroup(SubjectGroup.Arts)}>
                  <div className="flex-center">
                    <img alt="" src="/images/subject-categories/canvas.svg" />
                  </div>
                  <div className="cat-name">Arts</div>
                </div>
              </div>
              <div>
                <div onClick={() => this.moveToGroup(SubjectGroup.GeneralTopical)}>
                  <div className="flex-center">
                    <img alt="" src="/images/subject-categories/internet.svg" />
                  </div>
                  <div className="cat-name">Ceteral & Topical</div>
                </div>
              </div>
              <div>
                <div onClick={() => this.moveToGroup(SubjectGroup.HumanitiesAndSocialSciences)}>
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
                <div onClick={() => this.moveToGroup(SubjectGroup.Languages)}>
                  <div className="flex-center">
                    <img alt="" src="/images/subject-categories/translating.svg" />
                  </div>
                  <div className="cat-name">Languages</div>
                </div>
              </div>
              <div>
                <div onClick={() => this.moveToGroup(SubjectGroup.MathsAndComputing)}>
                  <div className="flex-center">
                    <img alt="" src="/images/subject-categories/binary-code.svg" />
                  </div>
                  <div className="cat-name">Maths and Computing</div>
                </div>
              </div>
              <div>
                <div onClick={() => this.moveToGroup(SubjectGroup.Science)}>
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
