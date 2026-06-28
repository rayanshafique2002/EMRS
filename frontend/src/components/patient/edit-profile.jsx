import React, { Component } from "react";
import { NavLink, Redirect } from "react-router-dom";
import axios from "axios";

class Edit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fname: "",
      lname: "",
      cnic: "",
      dob: "",
      gender: "male",
      blood: "A+",
      num: "",
      email: "",
      redirect: false,
    };
  }

  componentDidMount() {
    axios.get("/patient/profile").then((res) => {
      const data = (res.data && res.data.data) || {};
      this.setState({
        fname: data.f_name || "",
        lname: data.l_name || "",
        cnic: data.cnic || "",
        dob: data.dob || "",
        gender: data.gender || "male",
        blood: data.blood || "A+",
        num: data.phone_num || "",
        email: data.email || "",
      });
    });
  }

  ChangeHandle = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  SubmissionHandle = (e) => {
    e.preventDefault();
    const { fname, lname, num, cnic, dob, gender, blood } = this.state;
    axios
      .post("/patient/profile", {
        fname: fname,
        lname: lname,
        num: num,
        cnic: cnic,
        dob: dob,
        gender: gender,
        bloodGroup: blood,
      })
      .then(() => {
        this.setState({ redirect: true });
      });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/p/profile" />;
    }

    return (
      <div className="edit-wrapper">
        <h1 className="edit-page-title">Edit Profile</h1>
        <p className="edit-page-subtitle">Update your personal and contact details.</p>

        <form onSubmit={this.SubmissionHandle}>
          <div className="edit-form-group">
            <label htmlFor="fname">First Name</label>
            <input
              type="text"
              name="fname"
              id="fname"
              pattern="[A-Z a-z.]{1,20}"
              title="Can only consist of alphabets and must be between 1-20 characters"
              value={this.state.fname}
              placeholder="Your first name here"
              onChange={this.ChangeHandle}
            />
          </div>

          <div className="edit-form-group">
            <label htmlFor="lname">Last Name</label>
            <input
              type="text"
              name="lname"
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
              name="cnic"
              id="cnic"
              pattern="[0-9]{13}"
              title="Can only consist of thirteen integers"
              value={this.state.cnic}
              placeholder="13-digit CNIC number"
              onChange={this.ChangeHandle}
            />
          </div>

          <div className="edit-form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              name="dob"
              id="dob"
              value={this.state.dob}
              onChange={this.ChangeHandle}
            />
          </div>

          <div className="edit-form-group">
            <label htmlFor="gender">Gender</label>
            <select
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

          <div className="edit-form-group">
            <label htmlFor="blood">Blood Group</label>
            <select
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

          <div className="edit-form-group">
            <label htmlFor="num">Contact No.</label>
            <input
              type="text"
              name="num"
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
              name="email"
              id="email"
              value={this.state.email}
              readOnly
              disabled
              title="Email is your login and cannot be changed here"
            />
          </div>

          <div className="edit-form-actions">
            <input
              type="submit"
              value="Save Changes"
              className="btn-emrs-save"
            />
            <NavLink to="/p/profile">
              <input type="button" value="Cancel" className="btn-emrs-cancel" />
            </NavLink>
          </div>
        </form>
      </div>
    );
  }
}

export default Edit;
