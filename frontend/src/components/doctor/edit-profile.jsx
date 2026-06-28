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
    };
  }

  componentDidMount() {
    if (this.props.location.state) {
      const { fname, lname, contact } = this.props.location.state;
      this.setState({
        fname: fname,
        lname: lname,
        num: contact,
        redirect: false,
      });
    }
  }

  ChangeHandle = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  SubmissionHandle = (e) => {
    e.preventDefault();
    const { fname, lname, num } = this.state;
    axios
      .post("/doctor/profile", {
        fname: fname,
        lname: lname,
        num: num,
      })
      .then((res) => {
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

          <div className="edit-form-actions">
            <input
              type="submit"
              value="Save Changes"
              onSubmit={this.SubmissionHandle}
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
