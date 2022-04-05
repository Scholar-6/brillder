import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React, { useEffect, useState} from 'react';
import { connect } from "react-redux";

import userActions from "redux/actions/user";

interface Props {
  className?: string;
  getUser(): any;
}

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
    /*eslint-disable-next-line*/
  }, []);

  return (
    <div className={props.className}>
      {credits > 0 ? <SpriteIcon name="circle-lines" /> : <SpriteIcon name="circle-lines-blue" />}
      <span>{credits}</span>
    </div>
  );
}

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});


/**
 *  Credits will reload every 2seconds. Works only for current logged in user.
 */
export default connect(null, mapDispatch)(ReactiveUserCredits);
