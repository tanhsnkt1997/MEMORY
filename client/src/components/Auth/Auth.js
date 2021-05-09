import React, { useState } from "react";
import { Avatar, Button, Container, Grid, Paper, Typography } from "@material-ui/core";
import { GoogleLogin } from "react-google-login";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { AUTH } from "../../constants/actionTypes";
import { signin, signup } from "../../actions/auth";
import LockOutLinedIcon from "@material-ui/icons/LockOutlined";
import Input from "./input";
import Icon from "./icon";

import useStyles from "./style";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Auth = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, SetIsSignup] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
  // check and after that change screen name

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      dispatch(signup(formData, history));
    } else {
      dispatch(signin(formData, history));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const switchMode = () => {
    SetIsSignup((prevIsSignup) => !prevIsSignup);
    handleShowPassword(false);
  };

  //google
  const googleSuccess = async (res) => {
    console.log("Loggin google success", res);
    //res.profileObj ==> if  error: cannot get property profileObj of undefined
    const result = res?.profileObj; // if error : undefined
    const token = res?.tokenId;

    try {
      dispatch({ type: AUTH, data: { result, token } });
      //redirect to home after login success
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  const googleFailure = (err) => {
    console.log("Google SignIn was successfully. Try again latter !!", err);
  };
  return (
    <Container component='main' maxWidth='xs'>
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutLinedIcon />
        </Avatar>
        <Typography variant='h5'>{isSignup ? "Sign up" : "Sign In"}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Input name='firstName' label='First Name' variant='outlined' fullWidth handleChange={handleChange} autoFocus half />

                <Input name='lastName' label='Last Name' variant='outlined' fullWidth handleChange={handleChange} half />
              </>
            )}
            <Input name='email' label='Email Address' handleChange={handleChange} type='email' />
            <Input name='password' label='Password' handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
            {isSignup && <Input name='confirmPassword' label='Re Password' handleChange={handleChange} type='password' />}
          </Grid>

          <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
            {isSignup ? "Sign Up" : "Sign In"}
          </Button>

          {/* GOOGLE LOGIN */}
          <GoogleLogin
            clientId='674287327063-8erb1jtci7984iopuv7f6gdlre9ougpd.apps.googleusercontent.com'
            render={(renderProps) => (
              <Button
                className={classes.googleButton}
                color='primary'
                fullWidth
                onClick={renderProps.onClick}
                disable={renderProps.disabled}
                startIcon={<Icon />}
                variant='contained'>
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy={"single_host_origin"}
          />

          <Grid container justify='flex-end'>
            <Button onClick={switchMode}>{isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign up"}</Button>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
