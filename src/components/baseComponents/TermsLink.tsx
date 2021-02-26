
import React from "react";
import map from "components/map";
import { History } from "history";

interface TermsLinkProps {
    history: History;
}

const TermsLink: React.FC<TermsLinkProps> = ({history}) => {
  const moveToTerms = () => history.push(map.TermsPage);

 return (
    <div className="policy-text">
      <span>
        <a href={window.location.hostname + map.TermsPage} onClick={(e) => {e.preventDefault(); moveToTerms();}}>
          Terms
        </a>
      </span>
    </div>
  )
}

export default TermsLink;