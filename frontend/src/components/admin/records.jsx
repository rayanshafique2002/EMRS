import React, { Component } from "react";
import axios from "axios";
import { NavLink, Link } from "react-router-dom";

class AdminRecords extends Component {
  constructor(props) {
    super(props);
    const s = (props.location && props.location.state) || {};
    this.state = {
      data: [],
      offset: 0,
      limit: 5,
      total: 0,
      patId: s.patId || null,
      patName: s.patName || "",
    };
  }

  getRecords = () => {
    return axios.post("/admin/records-list", {
      offset: this.state.offset,
      pat_id: this.state.patId,
    });
  };

  loadRecords = () => {
    this.getRecords().then((res) => {
      const { records, total } = res.data.response;
      this.setState({
        data: records.slice(),
        total: total["count"],
      });
    });
  };

  componentDidMount() {
    this.loadRecords();
  }

  componentDidUpdate(prevProps) {
    const prev = (prevProps.location && prevProps.location.state) || {};
    const curr = (this.props.location && this.props.location.state) || {};
    if (prev.patId !== curr.patId) {
      this.setState(
        { patId: curr.patId || null, patName: curr.patName || "", offset: 0 },
        this.loadRecords
      );
    }
  }

  ClickHandle = (e) => {
    if (e.target.id === "back" && this.state.offset !== 0) {
      this.setState({ offset: this.state.offset - this.state.limit }, this.loadRecords);
    } else if (
      e.target.id === "next" &&
      this.state.offset + this.state.limit < this.state.total
    ) {
      this.setState({ offset: this.state.offset + this.state.limit }, this.loadRecords);
    }
  };

  render() {
    const { data, patId, patName } = this.state;
    return (
      <div className="list-container">
        {patId && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <h3 style={{ margin: 0, color: "var(--clr-text)" }}>
              Records for {patName || "patient"}
            </h3>
            <Link to="/a/records" onClick={() => this.setState({ patId: null, patName: "", offset: 0 }, this.loadRecords)}>
              <button type="button" className="btn btn-outline-secondary btn-sm">
                View all records
              </button>
            </Link>
          </div>
        )}
        <table className="table table-hover">
          <caption>
            Showing {this.state.total === 0 ? 0 : this.state.offset + 1} to{" "}
            {this.state.offset + data.length} of {this.state.total}
          </caption>
          <thead className="bg-primary table-dark">
            <tr>
              <th>Record #</th>
              <th>Date (DD/MM/YYYY)</th>
              <th>Patient Name</th>
              <th>Doctor Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="table-light">
            {data.map((tuple) => (
              <tr key={tuple.id}>
                <td>{tuple.id}</td>
                <td>{tuple.date}</td>
                <td>{[tuple.pat_fname, tuple.pat_lname].filter(Boolean).join(" ")}</td>
                <td>{[tuple.doc_fname, tuple.doc_lname].filter(Boolean).join(" ")}</td>
                <td>
                  <NavLink
                    to={{
                      pathname: "/a/view-record",
                      state: { id: tuple.id },
                    }}
                  >
                    <button type="button" className="btn btn-outline-primary btn-sm">
                      View
                    </button>
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {this.state.total === 0 && (
          <p style={{ padding: "16px", color: "var(--clr-text-muted)" }}>
            {patId
              ? "This patient has no records yet."
              : "No patient records have been created yet."}
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

export default AdminRecords;
