import React from "react";
import { NavLink } from "react-router-dom";
import "../css/navbar.css";
import logo from "../../img/LogoEmr.png";

const NavBar = () => (
  <div className="sidenav">
    <div className="logostyle">
      <img src={logo} alt="EMR" />
    </div>
    <ul>
      <li>
        <NavLink className="nav-link-item" to="/a/doc-accounts">
          <i className="material-icons nav-link-icon">people</i>
          Accounts
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link-item" to="/a/list-diseases">
          <i className="material-icons nav-link-icon">list</i>
          Diseases
        </NavLink>
      </li>
    </ul>
  </div>
);

export default NavBar;
