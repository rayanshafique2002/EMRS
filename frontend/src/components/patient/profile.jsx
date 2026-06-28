import React, { Component } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fname: "",
      lname: "",
      cnic: "",
      dob: "",
      email: "",
      gender: "",
      blood: "",
      num: "",
    };
  }

  getID = () => {
    const req = "/patient/profile/";
    return axios.get(req);
  };

  componentDidMount = () => {
    this.getID().then((d) => {
      const data = d.data.data;
      const {
        f_name,
        l_name,
        cnic,
        dob,
        email,
        gender,
        blood,
        phone_num,
      } = data;

      this.setState({
        fname: f_name,
        lname: l_name,
        cnic: cnic,
        dob: dob,
        email: email,
        gender: gender,
        blood: blood,
        num: phone_num,
      });
    });
  };

  render() {
    const { fname, lname, cnic, dob, email, gender, blood, num } = this.state;

    return (
      <div className="profile-wrapper">
        <div className="profile-header">
          <h1 className="profile-name">{fname + " " + lname}</h1>
          <NavLink
            className="profile-edit-button"
            to={{
              pathname: "edit-profile",
              state: {
                f_name: this.state.fname,
                l_name: this.state.lname,
                contact: this.state.num,
              },
            }}
          >
            <i className="material-icons" aria-hidden="true">edit</i>
            Edit
          </NavLink>
        </div>

        <div className="profile-grid">
          <div className="profile-field">
            <div className="profile-field-label">CNIC</div>
            <div className="profile-field-value">{cnic}</div>
          </div>
          <div className="profile-field">
            <div className="profile-field-label">Date of Birth</div>
            <div className="profile-field-value">{dob}</div>
          </div>
          <div className="profile-field">
            <div className="profile-field-label">Email</div>
            <div className="profile-field-value">{email}</div>
          </div>
          <div className="profile-field">
            <div className="profile-field-label">Gender</div>
            <div className="profile-field-value">{gender}</div>
          </div>
          <div className="profile-field">
            <div className="profile-field-label">Blood Group</div>
            <div className="profile-field-value">{blood}</div>
          </div>
          <div className="profile-field">
            <div className="profile-field-label">Contact No.</div>
            <div className="profile-field-value">{num}</div>
          </div>
        </div>

      </div>
    );
  }
}

export default Profile;
