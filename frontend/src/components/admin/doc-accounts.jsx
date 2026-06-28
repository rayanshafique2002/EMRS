import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class Accounts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      offset: 0,
      limit: 5,
      total: 0,
    };
  }

  getDoctors = () => {
    return new Promise((resolve, reject) => {
      axios
        .post("/admin/accounts-list", {
          offset: this.state.offset,
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  componentDidMount() {
    this.getDoctors().then((res) => {
      const { records, total } = res.data.response;
      this.setState({
        accounts: records.slice(),
        total: total["count"],
      });
    });
  }

  setDoctor = () => {
    this.getDoctors().then((res) => {
      const { records, total } = res.data.response;
      this.setState({
        accounts: records.slice(),
        total: total["count"],
      });
    });
  };

  deleteDoctor = (e) => {
    e.preventDefault();
    axios
      .post("/admin/delaccount", {
        email: e.target.id,
      })
      .then((res) => {
        this.setDoctor();
      });
  };

  nextHandle = () => {
    if (this.state.offset + this.state.limit < this.state.total) {
      this.setState(
        { offset: this.state.offset + this.state.limit },
        () => { this.setDoctor(); }
      );
    }
  };

  prevHandle = () => {
    if (this.state.offset !== 0) {
      this.setState(
        { offset: this.state.offset - this.state.limit },
        () => { this.setDoctor(); }
      );
    }
  };

  render() {
    return (
      <div className="list-container">
        <div className="row">
          <div className="col">
            <table className="table table-hover">
              <caption>
                Showing {this.state.offset + 1} –{" "}
                {this.state.offset + this.state.accounts.length} of{" "}
                {this.state.total}
              </caption>
              <thead className="bg-primary table-dark">
                <tr>
                  <th>Doctor Name</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="table-light">
                {this.state.accounts.map((user) => (
                  <tr key={user.id}>
                    <td>{user.doc_fname + " " + user.doc_lname}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        type="button"
                        id={user.email}
                        className="btn btn-outline-danger btn-sm"
                        onClick={this.deleteDoctor}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pag-controls">
              <button className="pag-btn" onClick={this.prevHandle}>
                &#8249;
              </button>
              <button className="pag-btn" onClick={this.nextHandle}>
                &#8250;
              </button>
            </div>
          </div>
          <div className="col-2">
            <Link to="/a/add-doc-account" style={{ width: "100%" }}>
              <button type="button" className="list-add-btn">
                + Add Doctor
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Accounts;
