import React, { useEffect, useState} from 'react';
import { connect } from "react-redux";

import userActions from "redux/actions/user";

interface Props {
  getUser(): any;
}

/**
 *  Credits will reload every 2seconds. Works only for current logged in user.
 */
const ReactiveUserCredits:React.FC<Props> = (props) => {
  const [credits, setCredits] = useState(0);

  const getCredits = async () => {
    const user = await props.getUser();
    setCredits(user.freeAttemptsLeft);
  }

  useEffect(() => {
    getCredits();
    
    const interval = setInterval(() => {
      getCredits();
    }, 2000);

    // free resources
    return () => { clearInterval(interval); }
  }, []);

  return <span>{credits}</span>
}

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});


export default connect(null, mapDispatch)(ReactiveUserCredits);
