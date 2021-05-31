import React, { useState, useEffect, useRef } from "react";
import memories from "../../images/memories.png";
import { AppBar, Typography, Toolbar, Avatar, Button, Box } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import Search from "./Search";
import useStyles from "./styles";
import "./modalChangeInfo.css";
import ModalChangeInfo from "./ModalChangeInfo";
import { RESET_FROFILE, GET_FROFILE, LOGOUT, RESET_MESSAGE_AUTH } from "../../constants/actionTypes";
import Notification from "./notication/Notification";
import jwt_decode from "jwt-decode";

import useSocket from "../../customHook/useSocket";

// document.querySelector('input[type="radio"]:checked')

const Navbar = () => {
  const childRef = useRef();
  const classes = useStyles();
  const user = useSelector((val) => val.user.profile);
  const userAsync = JSON.parse(localStorage.getItem("profile"));
  // useSocket(user?._id);

  // const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile"))); //default getItem null

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  // console.log("userNavbar Parent", user);

  // useEffect(() => {
  //   //JWT......
  //   // if (token) {
  //   //   const decodedToken = decode(token);
  //   //   if (decodedToken.exp * 1000 < new Date().getTime()) {
  //   //     // logout();
  //   //   }
  //   // }
  //   // setUser(JSON.parse(localStorage.getItem("profile")));
  //   // if ((location.pathname = "/")) {
  //   //   dispatch({ type: GET_FROFILE });
  //   // }
  // }, [location.pathname]);

  //run first if async have data.
  useEffect(() => {
    if (!user && userAsync) {
      dispatch({ type: GET_FROFILE });
      dispatch({ type: RESET_MESSAGE_AUTH });
    }
  }, [dispatch, user, userAsync]);

  const logout = () => {
    dispatch({ type: LOGOUT });
    dispatch({ type: RESET_FROFILE });
    history.push("/");
  };

  return (
    <>
      <AppBar className={classes.appBar} position="fixed" color="inherit">
        <div className={classes.brandContainer}>
          <Typography component={"a"} href="/" className={classes.heading} variant="h2" align="center">
            Memories
          </Typography>
          <img className={classes.image} src={memories} alt="icon" height="60" />
        </div>
        {/* SEARCH BAR */}
        <Search user={user} />

        <Toolbar className={classes.toolbar}>
          <Notification userId={user?._id} />
          {user ? (
            <div className={classes.profile}>
              <Box style={{ cursor: "pointer" }} display="flex" onClick={() => childRef.current.isOpenModal()}>
                {/* google avatar and account avatar */}
                <Avatar className={classes.purple} alt={user.name} src={user.avatar}>
                  {user.name.charAt(0)}
                </Avatar>
                <Typography className={classes.userName} variant="h6">
                  {user.name}
                </Typography>
              </Box>

              <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div>
              <Button component={Link} to="/auth" variant="contained" color="primary">
                Sign In
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {user && <ModalChangeInfo ref={childRef} />}
    </>
  );
};

export default React.memo(Navbar);
