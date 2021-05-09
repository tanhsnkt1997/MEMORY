import React, { useState, useEffect } from "react";
import memories from "../../images/memories.png";
import { AppBar, Typography, Toolbar, Avatar, Button, Box } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import Search from "./Search";

import useStyles from "./styles";

const Navbar = () => {
  const classes = useStyles();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile"))); //default getItem null
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    //JWT......
    // if (token) {
    //   const decodedToken = decode(token);
    //   if (decodedToken.exp * 1000 < new Date().getTime()) {

    //     // logout();
    //   }
    // }
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location.pathname]);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/");
    setUser(null); //show btn login
  };
  return (
    <AppBar className={classes.appBar} position='fixed' color='inherit'>
      <div className={classes.brandContainer}>
        <Typography component={"a"} href='/' className={classes.heading} variant='h2' align='center'>
          Memories
        </Typography>
        <img className={classes.image} src={memories} alt='icon' height='60' />
      </div>
      {/* SEARCH BAR */}
      <Search user={user} />

      <Toolbar className={classes.toolbar}>
        {user ? (
          <div className={classes.profile}>
            <Box display='flex'>
              <Avatar className={classes.purple} alt={user.name} src={user.imageUrl}>
                {user.name.charAt(0)}
              </Avatar>
              <Typography className={classes.userName} variant='h6'>
                {user.name}
              </Typography>
            </Box>

            <Button variant='contained' className={classes.logout} color='secondary' onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <div>
            <Button component={Link} to='/auth' variant='contained' color='primary'>
              Sign In
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
