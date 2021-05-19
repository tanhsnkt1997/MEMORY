import React, { useState } from "react";
import { Avatar, Button, Container, Grid, Paper, Typography } from "@material-ui/core";
import { GoogleLogin } from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { AUTH, RESET_MESSAGE_AUTH } from "../../constants/actionTypes";
import { signin, signup } from "../../actions/auth";
import LockOutLinedIcon from "@material-ui/icons/LockOutlined";
import Input from "./input";
import Icon from "./icon";
import InputCustom from "../Base/input";

import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm, ErrorMessage } from "react-hook-form";

import useStyles from "./style";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .max(50, "Email max 50 character")
    .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Email is invalid format"),
  password: Yup.string()
    .required("Password is required")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character")
    .max(50, "Password max 50 character"),

  confirmPassword: Yup.string().when("$isSignup", {
    is: (exist) => exist,
    then: Yup.string()
      .required("Re-password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    otherwise: Yup.string(),
  }),
  firstName: Yup.string().when("$isSignup", {
    is: (exist) => exist,
    then: Yup.string().required("First name is required").max(10, "First name max 50 character"),
    // otherwise: Yup.string(),
  }),

  lastName: Yup.string().when("$isSignup", {
    is: (exist) => exist,
    then: Yup.string().required("Last name is required").max(10, "First name max 50 character"),
    // otherwise: Yup.string(),
  }),
});

const a = validationSchema
  .validate(
    {},
    {
      context: { exist: false },
    }
  )
  .catch((err) => console.log(err));

const Auth = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const errorAuth = useSelector((data) => data.auth.error);

  const [isSignup, SetIsSignup] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    context: { isSignup: isSignup },
    resolver: yupResolver(validationSchema),
  });

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const switchMode = () => {
    dispatch({ type: RESET_MESSAGE_AUTH });
    reset();
    SetIsSignup((prevIsSignup) => !prevIsSignup);
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

  const onSubmit = (data) => {
    console.log("data", data);
    if (isSignup) {
      dispatch(signup(data, history));
    } else {
      dispatch(signin(data, history));
    }
  };

  const handleShowMessage = () => {
    if (errorAuth) {
      switch (errorAuth.auth) {
        case "signup": {
          if (errorAuth.statusCode === 409) {
            return <p className={"auth-Validation-Error"}>Email đã được sử dụng.</p>;
          }
          if (errorAuth.statusCode === 500) {
            return <p className={"auth-Validation-Error"}>Đăng kí thất bại. Vui lòng thử lại.</p>;
          }
          break;
        }
        case "signin":
          return <p className={"auth-Validation-Error"}>Đăng nhập thất bại vui lòng kiểm tra lại thông tin.</p>;

        default:
          break;
      }
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutLinedIcon />
        </Avatar>
        <Typography variant="h5">{isSignup ? "Sign up" : "Sign In"}</Typography>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)} onReset={reset}>
          {handleShowMessage()}

          <Grid container spacing={2}>
            {isSignup && (
              <>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "50%", margin: "10px" }}>
                    <p className={"auth-Validation-Error"}>{errors.firstName?.message}</p>
                    <InputCustom register={register} name="firstName" placeholder="First Name *" />
                  </div>
                  <div style={{ width: "50%", margin: "10px" }}>
                    <p className={"auth-Validation-Error"}>{errors.lastName?.message}</p>
                    <InputCustom register={register} name="lastName" placeholder="Last Name *" />
                  </div>
                </div>

                {/* <Input name="firstName" label="First Name" variant="outlined" fullWidth handleChange={handleChange} autoFocus half />

                <Input name="lastName" label="Last Name" variant="outlined" fullWidth handleChange={handleChange} half /> */}
              </>
            )}
            {/* <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} /> */}
            <div style={{ width: "100%", margin: "10px" }}>
              <p className={"auth-Validation-Error"}>{errors.email?.message}</p>
              <InputCustom register={register} name="email" placeholder="Email Address *" />
            </div>
            <div style={{ width: "100%", margin: "10px" }}>
              <p className={"auth-Validation-Error"}>{errors.password?.message}</p>
              <InputCustom register={register} name="password" placeholder="Password *" password={true} />
            </div>

            {isSignup && (
              <div style={{ width: "100%", margin: "10px" }}>
                <p className={"auth-Validation-Error"}>{errors.confirmPassword?.message}</p>
                <InputCustom register={register} name="confirmPassword" placeholder="Re-password *" password={true} />
              </div>
            )}
          </Grid>

          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            {isSignup ? "Sign Up" : "Sign In"}
          </Button>

          {/* GOOGLE LOGIN */}
          <GoogleLogin
            clientId="674287327063-8erb1jtci7984iopuv7f6gdlre9ougpd.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disable={renderProps.disabled} startIcon={<Icon />} variant="contained">
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy={"single_host_origin"}
          />

          <Grid container justify="flex-end">
            <Button onClick={switchMode}>{isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign up"}</Button>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;

// field1: yup.string().required('This field is required'),
// field2: yup.string().notRequired()
// .when('field1', {
// is: (val) => val !== undefined,
// then: yup.string().required('This field is required now),
// otherwise: yup.string().notRequired()
// })
