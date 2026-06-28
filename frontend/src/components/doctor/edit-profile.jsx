import React, { Component } from "react";
import { NavLink, Redirect } from "react-router-dom";
import axios from "axios";

class DocEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fname: "",
      lname: "",
      num: "",
      cnic: "",
      email: "",
      redirect: false,
    };
  }

  componentDidMount() {
    axios.get("/doctor/profile").then((res) => {
      const data = (res.data && res.data.data) || {};
      this.setState({
        fname: data.f_name || "",
        lname: data.l_name || "",
        num: data.phone_num || "",
        cnic: data.cnic || "",
        email: data.email || "",
      });
    });
  }

  ChangeHandle = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  SubmissionHandle = (e) => {
    e.preventDefault();
    const { fname, lname, num, cnic } = this.state;
    axios
      .post("/doctor/profile", {
        fname: fname,
        lname: lname,
        num: num,
        cnic: cnic,
      })
      .then(() => {
        this.setState({ redirect: true });
      });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/d/profile" />;
    }

    return (
      <div className="edit-wrapper">
        <h1 className="edit-page-title">Edit Profile</h1>
        <p className="edit-page-subtitle">Update your contact and name details.</p>

        <form onSubmit={this.SubmissionHandle}>
          <div className="edit-form-group">
            <label htmlFor="fname">First Name</label>
            <input
              type="text"
              id="fname"
              pattern="[A-Z a-z.]{1,20}"
              title="Can only contain alphabets and must be between 1-20 characters"
              value={this.state.fname}
              placeholder="Your first name here"
              onChange={this.ChangeHandle}
            />
          </div>

          <div className="edit-form-group">
            <label htmlFor="lname">Last Name</label>
            <input
              type="text"
              id="lname"
              pattern="[A-Z a-z.]{1,20}"
              title="Can only contain alphabets and must be between 1-20 characters"
              value={this.state.lname}
              placeholder="Your last name here"
              onChange={this.ChangeHandle}
            />
          </div>

          <div className="edit-form-group">
            <label htmlFor="cnic">CNIC</label>
            <input
              type="text"
              id="cnic"
              pattern="[0-9]{13}"
              title="Can only consist of thirteen integers"
              value={this.state.cnic}
              placeholder="13-digit CNIC number"
              onChange={this.ChangeHandle}
            />
          </div>

          <div className="edit-form-group">
            <label htmlFor="num">Contact No.</label>
            <input
              type="text"
              id="num"
              pattern="[0-9]{11}"
              title="Can only consist of eleven integers"
              value={this.state.num}
              placeholder="Your contact number here"
              onChange={this.ChangeHandle}
            />
          </div>

          <div className="edit-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={this.state.email}
              readOnly
              disabled
              title="Email is your login and is managed by the administrator"
            />
          </div>

          <div className="edit-form-actions">
            <input
              type="submit"
              value="Save Changes"
              className="btn-emrs-save"
            />
            <NavLink to="/d/profile">
              <input type="button" value="Cancel" className="btn-emrs-cancel" />
            </NavLink>
          </div>
        </form>
      </div>
    );
  }
}

export default DocEdit;
