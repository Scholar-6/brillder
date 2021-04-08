import React from "react";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import queryString from 'query-string';
import { connect } from "react-redux";

import { isPhone } from "services/phone";
import DesktopVersionDialog from "./baseComponents/dialogs/DesktopVersionDialog";

import routes from "./routes";
import InvestigationBuildPage, {
  InvestigationBuildProps,
} from "./investigationBuildPage";

import Proposal from "./proposal/Proposal";
import { ReduxCombinedState } from "redux/reducers";

const BuildRouter: React.FC<InvestigationBuildProps> = (props) => {
  if (isPhone()) {
    return (
      <div className="blue-page">
        <DesktopVersionDialog history={props.history} />
      </div>
    );
  }

  const renderInvestigationPage = () => {
    const values = queryString.parse(props.location.search);
    let initSuggestionExpanded = false;
    if (values.suggestionsExpanded) {
      initSuggestionExpanded = true;
    }
  
    const isCurrentEditor = (props.reduxBrick.editors?.findIndex((e: any) => e.id === props.user.id) ?? -1) >= 0;
    if (isCurrentEditor) {
      initSuggestionExpanded = true;
    }
    return <InvestigationBuildPage {...props} isCurrentEditor={isCurrentEditor} initSuggestionExpanded={initSuggestionExpanded} />;
  }

  return (
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
  );
};

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  reduxBrick: state.brick.brick
});

export default connect(mapState)(BuildRouter);
