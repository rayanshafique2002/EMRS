import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import "../css/records-styles.css";

class AdminView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: 0,
      patName: "",
      docName: "",
      dob: "",
      gender: "",
      date: "",
      prescription: "",
      observation: "",
      disease: [],
    };
  }

  getRecord() {
    const id = this.state.id;
    if (id !== -1) {
      axios.post("/admin/record", { rid: id }).then((result) => {
        const data = result.data.res.data;
        if (!data) {
          this.setState({ id: -1 });
          return;
        }
        const docName = [data.doc_fname, data.doc_lname].filter(Boolean).join(" ");
        const patName = [data.pat_fname, data.pat_lname].filter(Boolean).join(" ");
        const diseases = result.data.res.diseases.map((element) => element.disease);

        this.setState({
          id: data.id,
          patName: patName,
          docName: docName,
          dob: data.dob,
          gender: data.gender,
          date: data.date,
          prescription: data.prescription,
          observation: data.observation,
          disease: diseases,
        });
      });
    }
  }

  componentDidMount() {
    if (this.props.location.state) {
      const { id } = this.props.location.state;
      this.setState({ id: id }, () => {
        this.getRecord();
      });
    } else {
      this.setState({ id: -1 });
    }
  }

  render() {
    if (this.state.id === -1) {
      return <Redirect to="/a/records" />;
    }

    const {
      id,
      patName,
      docName,
      dob,
      gender,
      date,
      prescription,
      observation,
      disease,
    } = this.state;

    return (
      <div className="record-view-wrapper">
        <div className="record-view-header">
          <h2 className="record-view-title">Medical Record #{id}</h2>
          <span className="record-view-date">Date: {date}</span>
        </div>

        <div className="record-meta-row">
          <div className="record-meta-field">
            <span className="record-meta-value">{patName}</span>
            <span className="record-meta-label">Name</span>
          </div>
          <div className="record-meta-field">
            <span className="record-meta-value">{dob}</span>
            <span className="record-meta-label">DOB</span>
          </div>
          <div className="record-meta-field">
            <span className="record-meta-value">{gender}</span>
            <span className="record-meta-label">Gender</span>
          </div>
          <div className="record-meta-field">
            <span className="record-meta-value">{docName}</span>
            <span className="record-meta-label">Doctor</span>
          </div>
        </div>

        <div className="record-cards-row">
          <div className="record-card">
            <h4>Prescription</h4>
            <textarea className="record-card-scroll" readOnly={true} value={prescription || ""} />
          </div>
          <div className="record-card">
            <h4>Observations</h4>
            <textarea className="record-card-scroll" readOnly={true} value={observation || ""} />
          </div>
          <div className="record-card">
            <h4>Disease(s)</h4>
            <ul className="record-card-scroll">
              {disease.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminView;
