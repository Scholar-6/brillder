import React from "react";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import { isPhone } from "services/phone";
import DesktopVersionDialog from "./baseComponents/dialogs/DesktopVersionDialog";

import routes from "./routes";
import InvestigationBuildPage, {
  InvestigationBuildProps,
} from "./investigationBuildPage";

import Proposal from "./proposal/Proposal";

const BuildRouter: React.FC<InvestigationBuildProps> = (props) => {
  if (isPhone()) {
    return (
      <div className="blue-page">
        <DesktopVersionDialog history={props.history} />
      </div>
    );
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
        <InvestigationBuildPage {...props} />
      </Route>
    </Switch>
  );
};

export default BuildRouter;
