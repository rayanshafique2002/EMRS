import React, { Component } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

class Records extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      offset: 0,
      limit: 5,
      total: 0,
    };
  }

  getRecords = () => {
    return new Promise((resolve, reject) => {
      axios
        .post("/patient/recordslist", {
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

  componentDidMount = () => {
    this.getRecords().then((res) => {
      const { records, total } = res.data.response;
      this.setState({
        data: records.slice(),
        total: total["count"],
      });
    });
  };

  setRecords = () => {
    this.getRecords().then((res) => {
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
        this.setRecords();
      });
    } else if (
      e.target.id === "next" &&
      this.state.offset + this.state.limit < this.state.total
    ) {
      const newOffset = this.state.offset + this.state.limit;
      this.setState({ offset: newOffset }, () => {
        this.setRecords();
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
              <th>Record #</th>
              <th>Date (DD/MM/YYYY)</th>
              <th>Doctor Name</th>
              <th></th>
            </tr>
          </thead>
          {data.map((tuple) => (
            <tbody key={tuple.id} className="table-light">
              <tr>
                <td>{tuple.id}</td>
                <td>{tuple.date}</td>
                <td>{tuple.doc_fname + " " + tuple.doc_lname}</td>
                <td>
                  <NavLink
                    to={{
                      pathname: "view-record",
                      state: { id: tuple.id },
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                    >
                      View
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

export default Records;
