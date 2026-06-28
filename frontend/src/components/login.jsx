import React from "react";
import logo from "../img/LogoEmr.png";
import "./css/login.css";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      regEmail: "",
      regPassword: "",
      regUsername: "",
      regRole: "patient",
      registering: false,
      message: "",
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    try {
      const res = await fetch("/auth/local/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        // redirect based on role if provided
        if (data.role === "patient") window.location.href = "/p/dashboard";
        else if (data.role === "doctor") window.location.href = "/d/dashboard";
        else if (data.role === "admin") window.location.href = "/a/dashboard";
        else window.location.href = "/";
      } else {
        this.setState({ message: data.message || "Login failed" });
      }
    } catch (err) {
      this.setState({ message: "Server error" });
    }
  };

  handleRegister = async (e) => {
    e.preventDefault();
    const { regEmail, regPassword, regUsername, regRole } = this.state;
    try {
      const res = await fetch("/auth/local/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: regEmail,
          password: regPassword,
          username: regUsername,
          role: regRole,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        if (regRole === "doctor") {
          window.location.href = "/d/dashboard";
        } else {
          window.location.href = "/newprofile";
        }
      } else {
        this.setState({ message: data.message || "Registration failed" });
      }
    } catch (err) {
      this.setState({ message: "Server error" });
    }
  };

  toggleRegister = () => {
    this.setState((s) => ({ registering: !s.registering, message: "" }));
  };

  render() {
    const { email, password, regEmail, regPassword, regUsername, regRole, registering, message } = this.state;
    return (
      <div className="container-fluid MainContainer">
        <div className="card CardStyle">
          <div className="card-body">
            <header className="HeaderStyle">
              <img src={logo} alt="EMR" className="ImgStyle" />
            </header>
            {!registering ? (
              <>
                <h5 className="card-title text-center HeadingStyle">Sign In</h5>
                <hr className="my-4"></hr>
                <form className="FormStyle" onSubmit={this.handleLogin}>
                  <div className="LocalForm">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={email}
                      onChange={this.handleChange}
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={password}
                      onChange={this.handleChange}
                      required
                    />
                    <button type="submit" className="btn btn-primary">Sign in</button>
                    <button type="button" className="btn btn-link" onClick={this.toggleRegister}>
                      Register with email
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h5 className="card-title text-center HeadingStyle">Register</h5>
                <hr className="my-4"></hr>
                <form className="FormStyle" onSubmit={this.handleRegister}>
                  <div className="LocalForm">
                    <input
                      type="text"
                      name="regUsername"
                      placeholder="User name"
                      value={regUsername}
                      onChange={this.handleChange}
                      required
                    />
                    <input
                      type="email"
                      name="regEmail"
                      placeholder="Email"
                      value={regEmail}
                      onChange={this.handleChange}
                      required
                    />
                    <input
                      type="password"
                      name="regPassword"
                      placeholder="Password"
                      value={regPassword}
                      onChange={this.handleChange}
                      required
                    />
                    <label htmlFor="regRole" className="sr-only">Role</label>
                    <select
                      id="regRole"
                      name="regRole"
                      value={regRole}
                      onChange={this.handleChange}
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                    </select>
                    <button type="submit" className="btn btn-success">Register</button>
                    <button type="button" className="btn btn-link" onClick={this.toggleRegister}>
                      Back to login
                    </button>
                  </div>
                </form>
              </>
            )}

            {message && <div className="alert alert-danger mt-3">{message}</div>}
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
