import React, { Component } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

class PatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      offset: 0,
      limit: 5,
      total: 0,
    };
  }

  getPatients = () => {
    return new Promise((resolve, reject) => {
      axios
        .post("/doctor/patientslist", {
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
    this.getPatients().then((res) => {
      const { records, total } = res.data.response;
      this.setState({
        data: records.slice(),
        total: total["count"],
      });
    });
  }

  setPatients = () => {
    this.getPatients().then((res) => {
      const { records, total } = res.data.response;
      this.setState({
        data: records.slice(),
        total: total["count"],
      });
    });
  };

  ClickHandle = (e) => {
    if (e.target.id === "back" && this.state.offset !== 0) {
      const newOffset = this.state.offset - this.state.limit;
      this.setState({ offset: newOffset }, () => {
        this.setPatients();
      });
    } else if (
      e.target.id === "next" &&
      this.state.offset + this.state.limit < this.state.total
    ) {
      const newOffset = this.state.offset + this.state.limit;
      this.setState({ offset: newOffset }, () => {
        this.setPatients();
      });
    } else {
      return;
    }
  };

  render() {
    const { data } = this.state;
    return (
      <div className="list-container">
        <table className="table table-hover">
          <caption>
            Showing {this.state.offset + 1} to{" "}
            {this.state.offset + this.state.data.length} of {this.state.total}
          </caption>
          <thead className="bg-primary table-dark">
            <tr>
              <th>CNIC #</th>
              <th>Patient Name</th>
              <th>Contact No.</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          {data.map((tuple) => (
            <tbody className="table-light" key={tuple.id}>
              <tr>
                <td>{tuple.cnic}</td>
                <td>{tuple.pat_fname + " " + tuple.pat_lname}</td>
                <td>{tuple.num}</td>
                <td>{tuple.email}</td>
                <td>
                  <NavLink
                    to={{
                      pathname: "/d/add-records",
                      state: { id: tuple.id },
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                    >
                      Add Record
                    </button>
                  </NavLink>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
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

export default PatList;
