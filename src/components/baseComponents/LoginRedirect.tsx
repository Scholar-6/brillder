import map from "components/map";
import React from "react";
import { connect } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import authActions from "redux/actions/auth";
import { ReduxCombinedState } from "redux/reducers";

interface LoginRedirectProps {
    intendedPath: string;
    setIntendedPath(path: string): void;
}

const LoginRedirect: React.FC<LoginRedirectProps> = props => {
    const location = useLocation();
    React.useEffect(() => {
        console.log("setting intended path to ", location.pathname)
        props.setIntendedPath(location.pathname);
    }, [location]);

    return <Redirect to={map.Login} />;
};

const mapState = (state: ReduxCombinedState) => ({
    intendedPath: state.auth.intendedPath,
});

const mapDispatch = (dispatch: any) => ({
    setIntendedPath: (path: string) => dispatch(authActions.setIntendedPath(path)),
});

export default connect(mapState, mapDispatch)(LoginRedirect);