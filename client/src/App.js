import React from "react";
import { Container, Toolbar } from "@material-ui/core";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";
import NotFound from "./components/404/NotFound";

const App = () => {
  const routes = [
    { path: "/", component: Home, exact: true, key: "1" },
    { path: "/posts/:slug?", component: Home, exact: true, key: "2" },
    { path: "*", component: NotFound, exact: false, key: "3" },
  ];
  return (
    <BrowserRouter>
      <Container maxWidth="lg">
        <Navbar />
        <Toolbar />
        <Toolbar />
        <Switch>
          <Route path="/auth" exact component={Auth} />
          {/* <Redirect from="/posts/:slug" to='/' exact /> */}
          {routes.map((route) => (
            <Route key={route.key} path={route.path} exact={route.exact}>
              <route.component />
            </Route>
          ))}
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default App;
