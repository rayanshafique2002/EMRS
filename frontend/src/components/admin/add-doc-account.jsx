import React from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

class AddDocAccount extends React.Component {
  constructor() {
    super();
    this.state = {
      fname: "",
      lname: "",
      email: "",
      contact: "",
      cnic: "",
      redirect: false,
    };
  }

  ChangeHandle = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  SubmissionHandle = (e) => {
    e.preventDefault();
    const { fname, lname, email, contact, cnic } = this.state;

    axios
      .post("/admin/account", {
        fname: fname,
        lname: lname,
        email: email,
        num: contact,
        cnic: cnic,
      })
      .then(() => {
        this.setState({ redirect: true });
      });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/a/doc-accounts" />;
    }

    return (
      <div className="reg-page">
        <div className="reg-card">
          <div className="reg-card-body">
            <h2 className="reg-title">Create Doctor Account</h2>
            <form onSubmit={this.SubmissionHandle}>
              <div className="row">
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
                  />

                  <label className="reg-form-label" htmlFor="email">Email</label>
                  <input
                    className="reg-form-input"
                    type="text"
                    name="email"
                    id="email"
                    value={this.state.email}
                    placeholder="Email address"
                    onChange={this.ChangeHandle}
                  />
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
                  />

                  <label className="reg-form-label" htmlFor="contact">Contact No.</label>
                  <input
                    className="reg-form-input"
                    type="text"
                    name="contact"
                    id="contact"
                    pattern="[0-9]{11}"
                    title="Can only consist of eleven integers"
                    value={this.state.contact}
                    placeholder="11-digit phone number"
                    onChange={this.ChangeHandle}
                  />
                </div>
              </div>

              <div className="row" style={{ marginTop: "8px" }}>
                <div className="col-12">
                  <label className="reg-form-label" htmlFor="cnic">CNIC</label>
                  <input
                    className="reg-form-input"
                    type="text"
                    name="cnic"
                    id="cnic"
                    pattern="[0-9]{13}"
                    title="Can only contain of thirteen integers"
                    value={this.state.cnic}
                    placeholder="13-digit CNIC number"
                    onChange={this.ChangeHandle}
                  />
                </div>
              </div>

              <div className="reg-actions">
                <input
                  type="submit"
                  value="Create Account"
                  onSubmit={this.SubmissionHandle}
                  className="btn-emrs-save"
                />
                <Link to="/a/doc-accounts">
                  <input type="button" value="Cancel" className="btn-emrs-cancel" />
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AddDocAccount;
