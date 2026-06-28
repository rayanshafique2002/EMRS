import React, { Component } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

class AdminPatients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      offset: 0,
      limit: 5,
      total: 0,
      message: "",
    };
  }

  getPatients = () => {
    return axios.post("/admin/patients-list", { offset: this.state.offset });
  };

  loadPatients = () => {
    this.getPatients().then((res) => {
      const { records, total } = res.data.response;
      this.setState({
        data: records.slice(),
        total: total["count"],
        message: "",
      });
    });
  };

  deletePatient = (patient) => {
    const patientName = [patient.pat_fname, patient.pat_lname]
      .filter(Boolean)
      .join(" ");
    const confirmed = window.confirm(
      `Delete ${patientName || "this patient"} and all of their records? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    axios
      .post("/admin/patient/delete", { id: patient.id })
      .then(() => {
        const isLastItemOnPage =
          this.state.data.length === 1 && this.state.offset >= this.state.limit;

        if (isLastItemOnPage) {
          this.setState(
            { offset: this.state.offset - this.state.limit, message: "" },
            this.loadPatients
          );
        } else {
          this.loadPatients();
        }
      })
      .catch((err) => {
        const message =
          (err.response && err.response.data && err.response.data.message) ||
          "Failed to delete patient";
        this.setState({ message });
      });
  };

  componentDidMount() {
    this.loadPatients();
  }

  ClickHandle = (e) => {
    if (e.target.id === "back" && this.state.offset !== 0) {
      this.setState({ offset: this.state.offset - this.state.limit }, this.loadPatients);
    } else if (
      e.target.id === "next" &&
      this.state.offset + this.state.limit < this.state.total
    ) {
      this.setState({ offset: this.state.offset + this.state.limit }, this.loadPatients);
    }
  };

  render() {
    const { data } = this.state;
    return (
      <div className="list-container">
        <table className="table table-hover">
          <caption>
            Showing {this.state.total === 0 ? 0 : this.state.offset + 1} to{" "}
            {this.state.offset + data.length} of {this.state.total}
          </caption>
          <thead className="bg-primary table-dark">
            <tr>
              <th>CNIC #</th>
              <th>Patient Name</th>
              <th>Contact No.</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="table-light">
            {data.map((tuple) => (
              <tr key={tuple.id}>
                <td>{tuple.cnic}</td>
                <td>{[tuple.pat_fname, tuple.pat_lname].filter(Boolean).join(" ")}</td>
                <td>{tuple.num}</td>
                <td>{tuple.email}</td>
                <td>{tuple.gender}</td>
                <td>
                  <NavLink
                    to={{
                      pathname: "/a/records",
                      state: {
                        patId: tuple.id,
                        patName: [tuple.pat_fname, tuple.pat_lname]
                          .filter(Boolean)
                          .join(" "),
                      },
                    }}
                  >
                    <button type="button" className="btn btn-outline-primary btn-sm">
                      View Records
                    </button>
                  </NavLink>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    style={{ marginLeft: "8px" }}
                    onClick={() => this.deletePatient(tuple)}
                  >
                    Delete
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
        {this.state.total === 0 && (
          <p style={{ padding: "16px", color: "var(--clr-text-muted)" }}>
            No patients are registered yet.
          </p>
        )}
        <div className="pag-controls">
          <button className="pag-btn" onClick={this.ClickHandle} id="back">
            &#8249;
          </button>
          <button className="pag-btn" onClick={this.ClickHandle} id="next">
            &#8250;
          </button>
        </div>
      </div>
    );
  }
}

export default AdminPatients;
