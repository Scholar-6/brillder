import React from "react";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";
//import queryString from 'query-string';
import { connect } from "react-redux";

import { isPhone } from "services/phone";
import DesktopVersionDialog from "./baseComponents/dialogs/DesktopVersionDialog";

import routes from "./routes";
import InvestigationBuildPage, {
  InvestigationBuildProps,
} from "./investigationBuildPage";

import Proposal from "./proposal/Proposal";
import { ReduxCombinedState } from "redux/reducers";
import axios from "axios";
import ReloadDialog from "components/baseComponents/dialogs/ReloadDialog";
import map from "components/map";

const BuildRouter: React.FC<InvestigationBuildProps> = (props) => {
  const [isReloadOpen, setReload] = React.useState(false);

  if (isPhone()) {
    return (
      <div className="blue-page">
        <DesktopVersionDialog history={props.history} />
      </div>
    );
  }

  axios.interceptors.response.use((response) => {
    return response;
  }, function (error) {
    if (error.response && error.response.status === 403) {
      setReload(true);
    }
  });

  const reload = () => {
    props.history.push(map.Login);
  }

  const renderInvestigationPage = () => {
    /*
    const values = queryString.parse(props.location.search);
    let initSuggestionExpanded = false;
    if (values.suggestionsExpanded) {
      initSuggestionExpanded = true;
    }
  
    const isCurrentEditor = (props.brick.editors?.findIndex((e: any) => e.id === props.user.id) ?? -1) >= 0;
    if (isCurrentEditor) {
      initSuggestionExpanded = true;
    }*/
    return <InvestigationBuildPage {...props} />;
  }

  return (
    <div>
    <Switch>
      <Route
        path={[
          routes.subjectRoute,
          routes.titleRoute,
          routes.openQuestionRoute,
          routes.lengthRoute,
          routes.briefRoute,
          routes.prepRoute,
        ]}
      >
        <Proposal
          history={props.history}
          location={props.location}
          match={props.match}
        />
      </Route>
      <Route path={routes.baseBuildRoute}>
        {renderInvestigationPage()}
      </Route>
    </Switch>
    <ReloadDialog isOpen={isReloadOpen} reload={reload} close={() => setReload(false)} />
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  brick: state.brick.brick
});

export default connect(mapState)(BuildRouter);
