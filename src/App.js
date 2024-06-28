import React from "react";
import Layout from "./Layout";
import "./App.css";
import RootRoutes from './RootRoute'


/**
 * App is a wrapper for <Layout>, you should not need to change this file.
 */

function App() {
  return (
    <div className="app-routes">
        <Layout />
        <RootRoutes />
      </div>
  );
}

export default App;
