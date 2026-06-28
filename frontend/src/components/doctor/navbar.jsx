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
        <NavLink className="nav-link-item" to="/d/profile">
          <i className="material-icons nav-link-icon">account_box</i>
          Profile
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link-item" to="/d/records">
          <i className="material-icons nav-link-icon">table_chart</i>
          Records
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link-item" to="/d/patList">
          <i className="material-icons nav-link-icon">library_add</i>
          Add Record
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link-item" to="/d/viz">
          <i className="material-icons nav-link-icon">insert_chart</i>
          Visualizations
        </NavLink>
      </li>
    </ul>
  </div>
);

export default NavBar;
