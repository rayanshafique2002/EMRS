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
      <h3 className="sidenav-title">Admin Menu</h3>
    </div>
    <ul>
      <li>
        <NavLink className="nav-link-item" to="/a/dashboard">
          <i className="material-icons nav-link-icon">dashboard</i>
          Dashboard
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link-item" to="/a/doc-accounts">
          <i className="material-icons nav-link-icon">people</i>
          Doctors
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link-item" to="/a/patients">
          <i className="material-icons nav-link-icon">personal_injury</i>
          Patients
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link-item" to="/a/records">
          <i className="material-icons nav-link-icon">table_chart</i>
          Records
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
