import React from "react";
import Header from "./Header";

import { Link, Outlet } from "react-router-dom";

function Layout() {

  return (
    <>
      <Header />
      <div className="container">
          <Link to="/">Home</Link>
          <Link to="/decks/new">Create Deck</Link>
          <br/>
          <Outlet />
      </div>
    </>
  );
}

export default Layout;
