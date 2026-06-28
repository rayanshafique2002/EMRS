import React from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

class EditDocAccount extends React.Component {
  constructor(props) {
    super(props);
    const s = (props.location && props.location.state) || {};
    this.state = {
      id: s.id || null,
      fname: s.fname || "",
      lname: s.lname || "",
      email: s.email || "",
      contact: s.contact || "",
      cnic: s.cnic || "",
      message: "",
      redirect: false,
    };
  }

  ChangeHandle = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  SubmissionHandle = (e) => {
    e.preventDefault();
    const { id, fname, lname, email, contact, cnic } = this.state;

    axios
      .post("/admin/account/update", {
        id: id,
        fname: fname,
        lname: lname,
        email: email,
        num: contact,
        cnic: cnic,
      })
      .then(() => {
        this.setState({ redirect: true });
      })
      .catch((err) => {
        const message =
          (err.response && err.response.data && err.response.data.message) ||
          "Failed to update account";
        this.setState({ message });
      });
  };

  render() {
    // No account context (e.g. page refreshed) — go back to the list.
    if (!this.state.id) {
      return <Redirect to="/a/doc-accounts" />;
    }

    if (this.state.redirect) {
      return <Redirect to="/a/doc-accounts" />;
    }

    return (
      <div className="reg-page">
        <div className="reg-card">
          <div className="reg-card-body">
            <h2 className="reg-title">Edit Doctor Account</h2>
            {this.state.message && (
              <div className="alert alert-danger">{this.state.message}</div>
            )}
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
                    type="email"
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
                    title="Can only contain thirteen integers"
                    value={this.state.cnic}
                    placeholder="13-digit CNIC number"
                    onChange={this.ChangeHandle}
                  />
                </div>
              </div>

              <div className="reg-actions">
                <input
                  type="submit"
                  value="Save Changes"
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

export default EditDocAccount;
