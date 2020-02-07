import React, { useState } from "react";
import { Grid, TextField } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import axios from 'axios';
import host from '../../hostname';


function LoginPage(props:any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log(props)

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
  
    axios.post(host.BACKEND_HOST + '/auth/login', {email, password}, {withCredentials: true}).then(resp => {
      const {data} = resp;
      if (data.errors) {
        alert(data.errors[0].msg);
        return;
      }
      if (data.msg) {
        alert(data.msg);
        return;
      }
      console.log(data);

      alert('Login successful')
      props.history.push('/')
    }).catch(e => {
      console.log(e);
      alert('Connection problem');
    });
  }

  return (
    <div className="Login">
      <Grid container direction="row" justify="center" className="mainPage" alignItems="center">
        <Grid container item xs={3}></Grid>
        <Grid container item xs={6}>
          <Card style={{margin: '40px 0 0 0'}}>
            <form onSubmit={handleSubmit}>
              <TextField
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{margin:'20px 30px 5px 30px'}}
                required
                label="Email" />
              <br></br>
              <TextField
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{margin:'5px 30px 5px 30px'}}
                required
                label="Password" />
              <br></br>
              <Button type="submit">Sign in</Button>
            </form>
          </Card>           
        </Grid>
      </Grid>
    </div>
  );
}

export default LoginPage
