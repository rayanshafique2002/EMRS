import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

class UpperBar extends React.Component {
  constructor() {
    super();
    this.state = {
      redirect: false,
      loading: true,
      displayName: "",
      role: "",
    };
  }

  componentDidMount() {
    axios
      .get("/auth/me")
      .then((res) => {
        const user = res.data.user || {};
        this.setState({
          displayName: user.displayName || user.email || "",
          role: user.role || "",
          loading: false,
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  logout = (e) => {
    e.preventDefault();
    axios.get("/auth/logout").then((res) => {
      if (res.data.status === "ok") {
        this.setState({
          redirect: true,
        });
      }
    });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }

    const userLabel = this.state.displayName
      ? `${this.state.role ? this.state.role.charAt(0).toUpperCase() + this.state.role.slice(1) : "User"}: ${this.state.displayName}`
      : "";

    return (
      <div className="upper-bar">
        <div className="upper-bar-user">
          <span className="material-icons">account_circle</span>
          <span>{this.state.loading ? "Loading user..." : userLabel}</span>
        </div>
        <button
          type="button"
          className="upper-bar-btn"
          onClick={this.logout}
        >
          Log Out
        </button>
      </div>
    );
  }
}

export default UpperBar;
