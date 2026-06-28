import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

class UpperBar extends React.Component {
  constructor() {
    super();
    this.state = {
      redirect: false,
    };
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

    return (
      <div className="upper-bar">
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
