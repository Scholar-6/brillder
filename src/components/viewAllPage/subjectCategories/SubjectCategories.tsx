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
import SpriteIcon from "components/baseComponents/SpriteIcon";
import TextDialog from "components/baseComponents/dialogs/TextDialog";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import MobileCategory from "../MobileCategory";

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
  invalidSubject: boolean;
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
      showFilters,
      invalidSubject: false,
    };
  }

  moveToGroup(sGroup: SubjectGroup) {
    this.props.setSubjectGroup(sGroup);
    this.props.history.push(map.ViewAllPage + '?subjectGroup=' + sGroup);
  }

  render() {
    if (isPhone()) {
      return <MobileCategory
        history={this.props.history}
        location={this.props.location}
      />
    }
    return (
      <React.Suspense fallback={<></>}>
        {isMobile ? <TabletTheme /> : <DesktopTheme />}
        <Grid container direction="row" className="sorted-row dashboard-all-subjects">
          <SubjectCategoriesSidebar />
          <div className="subject-categories">
            <div className="row">
              <div className="subject-category">
                <div onClick={() => this.moveToGroup(SubjectGroup.Arts)}>
                  <div className="flex-center zoom-item">
                    <SpriteIcon name="category-canvas" />
                  </div>
                  <div className="cat-name">Arts</div>
                </div>
              </div>
              <div>
                <div onClick={() => this.moveToGroup(SubjectGroup.GeneralTopical)}>
                  <div className="flex-center zoom-item">
                    <SpriteIcon name="category-internet" />
                  </div>
                  <div className="cat-name">General & Topical</div>
                </div>
              </div>
              <div>
                <div onClick={() => this.moveToGroup(SubjectGroup.HumanitiesAndSocialSciences)}>
                  <div className="flex-center zoom-item">
                    <SpriteIcon name="category-book" />
                  </div>
                  <div className="cat-name">Humanities & Social Sciences</div>
                </div>
              </div>
              <div className="subject-category disabled">
                <div onClick={() => this.setState({ invalidSubject: true })}>
                  <div className="flex-center zoom-item">
                    <SpriteIcon name="category-education" />
                  </div>
                  <div className="cat-name">School Client</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div>
                <div onClick={() => this.moveToGroup(SubjectGroup.Languages)}>
                  <div className="flex-center zoom-item">
                    <SpriteIcon name="category-translation" />
                  </div>
                  <div className="cat-name">Languages</div>
                </div>
              </div>
              <div>
                <div onClick={() => this.moveToGroup(SubjectGroup.MathsAndComputing)}>
                  <div className="flex-center zoom-item">
                    <SpriteIcon name="binary-code" />
                  </div>
                  <div className="cat-name">Maths and Computing</div>
                </div>
              </div>
              <div>
                <div onClick={() => this.moveToGroup(SubjectGroup.Science)}>
                  <div className="flex-center zoom-item">
                    <SpriteIcon name="category-chemistry" />
                  </div>
                  <div className="cat-name">Science</div>
                </div>
              </div>
              <div className="subject-category disabled">
                <div onClick={() => this.setState({ invalidSubject: true })}>
                  <div className="flex-center zoom-item">
                    <SpriteIcon name="category-economics" />
                  </div>
                  <div className="cat-name">Corporate</div>
                </div>
              </div>
            </div>
          </div>
        </Grid>
        <TextDialog className="bold-important" isOpen={this.state.invalidSubject} label="Hold tight, this subject category is coming soon." close={() => this.setState({ invalidSubject: false })} />
      </React.Suspense>
    );
  }
}

export default AllSubjectsPage;
