import React from "react";
import { NavLink } from "react-router-dom";
import "../css/navbar.css";
import logo from "../../img/LogoEmr.png";

const NavBar = () => (
  <div className="sidenav">
    <div className="logostyle">
      <img src={logo} alt="EMR" />
    </div>
    <div className="sidenav-header">
      <p className="sidenav-kicker">Healthcare Portal</p>
      <h3 className="sidenav-title">Patient Account</h3>
    </div>
    <ul>
      <li>
        <NavLink className="nav-link-item" to="/p/dashboard">
          <i className="material-icons nav-link-icon">dashboard</i>
          Dashboard
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link-item" to="/p/profile">
          <i className="material-icons nav-link-icon">account_box</i>
          Profile
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link-item" to="/p/records">
          <i className="material-icons nav-link-icon">table_chart</i>
          Records
        </NavLink>
      </li>
    </ul>
  </div>
);

export default NavBar;
