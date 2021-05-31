import React from "react";
import { Container, Toolbar } from "@material-ui/core";
import { BrowserRouter, Switch, Route, Redirect, useLocation } from "react-router-dom";
import WebSocketProvider, { WebSocketContext } from "./websocket/websocket";

import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";
import NotFound from "./components/404/NotFound";

const App = () => {
  let location = useLocation();

  const routes = [
    { path: "/auth", component: Auth, exact: true, key: "1" },
    { path: "/", component: Home, exact: true, key: "2" },
    { path: "/posts/:slug?", component: Home, exact: true, key: "3" },
    // { path: "*", component: NotFound, exact: false, key: "4" },
  ];

  return (
    <Container maxWidth="lg">
      <WebSocketProvider>
        <Navbar />
        <Toolbar />
        <Toolbar />
        {routes.map((route) => (
          <Route key={route.key} path={route.path} exact={route.exact}>
            <route.component />
          </Route>
        ))}
      </WebSocketProvider>
    </Container>
  );
};

export default App;
