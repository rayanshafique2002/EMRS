import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

class DocProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fname: "",
      lname: "",
      cnic: "",
      email: "",
      num: "",
    };
  }

  getID = () => {
    const req = "/doctor/profile/";
    return axios.get(req);
  };

  componentDidMount = () => {
    this.getID().then((d) => {
      const data = d.data.data;
      const { f_name, l_name, cnic, dob, email, phone_num } = data;

      this.setState({
        fname: f_name,
        lname: l_name,
        cnic: cnic,
        dob: dob,
        email: email,
        num: phone_num,
      });
    });
  };

  render() {
    const { fname, lname, cnic, email, num } = this.state;

    return (
      <div className="profile-wrapper">
        <h1 className="profile-name">{fname + " " + lname}</h1>

        <div className="profile-grid">
          <div className="profile-field">
            <div className="profile-field-label">CNIC</div>
            <div className="profile-field-value">{cnic}</div>
          </div>
          <div className="profile-field">
            <div className="profile-field-label">Contact No.</div>
            <div className="profile-field-value">{num}</div>
          </div>
          <div className="profile-field">
            <div className="profile-field-label">Email</div>
            <div className="profile-field-value">{email}</div>
          </div>
        </div>

        <NavLink
          to={{
            pathname: "edit-profile",
            state: {
              fname: this.state.fname,
              lname: this.state.lname,
              contact: this.state.num,
              cnic: this.state.cnic,
              email: this.state.email,
            },
          }}
        >
          <button
            type="button"
            className="btn btn-outline-primary"
            style={{ padding: "8px 24px", fontSize: "0.9rem" }}
          >
            Edit Profile
          </button>
        </NavLink>
      </div>
    );
  }
}

export default DocProfile;
