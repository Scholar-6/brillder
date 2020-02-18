import React, { useState } from "react";
import { Grid, TextField } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import axios from 'axios';


function RegisterPage(props:any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateForm = () => {
    if (email.length > 0 && password.length > 0 && confirmPassword.length > 0) {
      if (password !== confirmPassword) {
        return "Passwords not match";
      }
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
  
    axios.post(process.env.REACT_APP_BACKEND_HOST + '/auth/SignUp', {email, password, confirmPassword}).then(resp => {
      const {data} = resp;
      if (data.errors) {
        alert(data.errors[0].msg);
        return;
      }
      if (data.msg) {
        alert(data.msg);
      }
      
      props.history.push('/login')
    }).catch(e => {
      alert('Connection problem');
    });
  }

  return (
    <Grid className="login-page" container item justify="center" alignItems="center">
      <div className="login-container">
        <div className="login-logo">
          <img src="/images/lflogo.png" alt="logo" />
        </div>
        <Grid container direction="row">
          <Grid container item xs={12} justify="center">
            <Card className="login-card">
              <h1>Sign up with email</h1>
              <form onSubmit={handleSubmit}>
              <TextField
                type="email"
                value={email}
                className="login-field"
                onChange={e => setEmail(e.target.value)}
                required
                label="Email" />
              <br></br>
              <TextField
                type="password"
                value={password}
                className="login-field"
                onChange={e => setPassword(e.target.value)}
                required
                label="Password" />
              <br></br>
              <TextField
                type="password"
                value={confirmPassword}
                className="login-field password"
                onChange={e => setConfirmPassword(e.target.value)}
                required
                label="Confirm Password" />
              <br></br>
              <Grid container direction="row" justify="flex-end" alignItems="center">
                <Button variant="contained" color="primary" className="sign-in-button" type="submit">Sign up</Button>
              </Grid>
            </form>
            </Card>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid container item xs={12} justify="center">
            <img alt="fotter-logo" className="fotter" src="/images/brillder-2-logo.png" /><br />
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
}

export default RegisterPage
