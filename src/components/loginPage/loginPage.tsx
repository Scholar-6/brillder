import React, { useState } from "react";
import { Grid, TextField } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import actions from '../../redux/actions/auth';
import './loginPage.scss';
import { Redirect } from "react-router-dom";

const mapState = (state: any) => {
  return {
    isAuthenticated: state.auth.isAuthenticated ,
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    login: (model: any) => dispatch(actions.login(model)),
  }
}

const connector = connect(mapState, mapDispatch)

function LoginPage(props: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateForm = () => {
    if (email.length > 0 && password.length > 0) {
      return true;
    }
    return "Fill required fields";
  }

  function handleSubmit(event: any) {
    event.preventDefault();

    let res = validateForm();
    if (res !== true) {
      alert(res);
      return;
    }

    props.login({email, password});
  }

  if (props.isAuthenticated) {
    props.history.push("/");
  }

  const toRegister = () => {
    props.history.push('/register');
  }

  return (
    <Grid className="login-page" container item justify="center" alignItems="center">
      <div className="login-container">
        <div className="login-logo">
          <img src="/images/lflogo.png" alt="lol" />
        </div>
        <Grid container direction="row">
          <Grid container item xs={12} justify="center">
            <Card className="login-card">
              <h1>Sign in with email</h1>
              <form onSubmit={handleSubmit}>
                <TextField
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="login-field"
                  required
                  label="Email" />
                <br />
                <TextField
                  type="password"
                  value={password}
                  className="login-field password"
                  onChange={e => setPassword(e.target.value)}
                  required
                  label="Password" />
                <br />
                <Grid container direction="row" justify="flex-end" alignItems="center">
                  <Button variant="contained" color="primary" className="sign-in-button" onClick={toRegister}>Sign up</Button>
                  <Button variant="contained" color="primary" className="sign-in-button" type="submit">Sign in</Button>
                </Grid>
              </form>
            </Card>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid container item xs={12} justify="center">
            <img className="fotter" src="/images/brillder-2-logo.png" /><br />
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
}

export default connector(LoginPage);
