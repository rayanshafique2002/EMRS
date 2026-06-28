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
      message: "",
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
        message: "",
      });
    });
  };

  deleteDoctor = (e) => {
    e.preventDefault();
    const email = e.currentTarget.id;

    axios
      .post("/admin/delaccount", {
        id: e.currentTarget.dataset.id,
        email,
      })
      .then(() => {
        const isLastItemOnPage =
          this.state.accounts.length === 1 && this.state.offset >= this.state.limit;

        if (isLastItemOnPage) {
          this.setState(
            { offset: this.state.offset - this.state.limit, message: "" },
            this.setDoctor
          );
        } else {
          this.setDoctor();
        }
      })
      .catch((err) => {
        const message =
          (err.response && err.response.data && err.response.data.message) ||
          "Failed to delete doctor";
        this.setState({ message });
      });
  };

  nextHandle = () => {
    if (this.state.offset + this.state.limit < this.state.total) {
      this.setState(
        { offset: this.state.offset + this.state.limit },
        () => {
          this.setDoctor();
        }
      );
    }
  };

  prevHandle = () => {
    if (this.state.offset !== 0) {
      this.setState(
        { offset: this.state.offset - this.state.limit },
        () => {
          this.setDoctor();
        }
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
                Showing {this.state.offset + 1} -{" "}
                {this.state.offset + this.state.accounts.length} of {this.state.total}
              </caption>
              <thead className="bg-primary table-dark">
                <tr>
                  <th>Doctor Name</th>
                  <th>Email</th>
                  <th>CNIC</th>
                  <th>Contact No.</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-light">
                {this.state.accounts.map((user) => (
                  <tr key={user.id}>
                    <td>{[user.doc_fname, user.doc_lname].filter(Boolean).join(" ")}</td>
                    <td>{user.email}</td>
                    <td>{user.cnic}</td>
                    <td>{user.num}</td>
                    <td>
                      <Link
                        to={{
                          pathname: "/a/edit-doc-account",
                          state: {
                            id: user.id,
                            fname: user.doc_fname,
                            lname: user.doc_lname,
                            email: user.email,
                            cnic: user.cnic,
                            contact: user.num,
                          },
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          style={{ marginRight: "8px" }}
                        >
                          Edit
                        </button>
                      </Link>
                      <button
                        type="button"
                        data-id={user.id}
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
            {this.state.message && (
              <div className="alert alert-danger" style={{ marginTop: "12px" }}>
                {this.state.message}
              </div>
            )}
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
