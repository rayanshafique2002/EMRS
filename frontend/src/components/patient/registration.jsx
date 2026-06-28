import React, { Component } from "react";
import { NavLink, Redirect } from "react-router-dom";
import logo from "../../img/LogoEmr.png";
import "../css/registration.css";
import axios from "axios";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      fname: "",
      lname: "",
      cnic: "",
      dob: "",
      contact: "",
      gender: "male",
      blood: "A+",
      redirect: false,
    };
  }

  ChangeHandle = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  SubmissionHandle = (e) => {
    e.preventDefault();
    const { fname, lname, dob, contact, cnic, gender, blood } = this.state;
    axios
      .post("/patient/new", {
        fname: fname,
        lname: lname,
        dob: dob,
        num: contact,
        cnic: cnic,
        gender: gender,
        bloodGroup: blood,
      })
      .then((res) => {
        this.setState({ redirect: true });
      });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/p/profile" />;
    }

    return (
      <div className="reg-page">
        <div className="reg-card">
          <div className="reg-card-header">
            <img src={logo} alt="EMR" />
          </div>
          <div className="reg-card-body">
            <h2 className="reg-title">Create Patient Profile</h2>
            <form onSubmit={this.SubmissionHandle}>
              <div className="row">
                <div className="col-12">
                  <label className="reg-form-label" htmlFor="cnic">CNIC</label>
                  <input
                    className="reg-form-input"
                    type="text"
                    name="cnic"
                    id="cnic"
                    pattern="[0-9]{13}"
                    title="Can only consist of thirteen integers"
                    value={this.state.cnic}
                    placeholder="13-digit CNIC number"
                    onChange={this.ChangeHandle}
                    required
                  />
                </div>
              </div>

              <div className="row" style={{ marginTop: "8px" }}>
                <div className="col-6">
                  <label className="reg-form-label" htmlFor="fname">First Name</label>
                  <input
                    className="reg-form-input"
                    type="text"
                    name="fname"
                    id="fname"
                    pattern="[A-Z a-z.]{1,20}"
                    title="Can only contain alphabets and must be between 1-20 characters"
                    value={this.state.fname}
                    placeholder="First Name"
                    onChange={this.ChangeHandle}
                    required
                  />

                  <label className="reg-form-label" htmlFor="dob">Date of Birth</label>
                  <input
                    className="reg-form-input"
                    type="date"
                    name="dob"
                    id="dob"
                    value={this.state.dob}
                    onChange={this.ChangeHandle}
                    required
                  />

                  <label className="reg-form-label" htmlFor="gender">Gender</label>
                  <select
                    className="reg-form-input"
                    name="gender"
                    id="gender"
                    value={this.state.gender}
                    onChange={this.ChangeHandle}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="col-6">
                  <label className="reg-form-label" htmlFor="lname">Last Name</label>
                  <input
                    className="reg-form-input"
                    type="text"
                    name="lname"
                    id="lname"
                    pattern="[A-Z a-z.]{1,20}"
                    title="Can only contain alphabets and must be between 1-20 characters"
                    value={this.state.lname}
                    placeholder="Last Name"
                    onChange={this.ChangeHandle}
                    required
                  />

                  <label className="reg-form-label" htmlFor="contact">Contact No.</label>
                  <input
                    className="reg-form-input"
                    type="text"
                    name="contact"
                    id="contact"
                    pattern="[0-9]{11}"
                    title="Can consist of eleven integers only"
                    value={this.state.contact}
                    placeholder="11-digit phone number"
                    onChange={this.ChangeHandle}
                    required
                  />

                  <label className="reg-form-label" htmlFor="blood">Blood Group</label>
                  <select
                    className="reg-form-input"
                    name="blood"
                    id="blood"
                    value={this.state.blood}
                    onChange={this.ChangeHandle}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="reg-actions">
                <input
                  type="submit"
                  value="Create Profile"
                  onSubmit={this.SubmissionHandle}
                  className="btn-emrs-save"
                />
                <NavLink to="/">
                  <input type="button" value="Cancel" className="btn-emrs-cancel" />
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
