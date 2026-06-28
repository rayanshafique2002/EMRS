import React, { Component } from "react";
import axios from "axios";
import { Redirect, Link } from "react-router-dom";
import "../css/records-styles.css";
import pdfIcon from "../../img/pdfIcon.svg";

class DocView extends Component {
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
      private_note: "",
      disease: [],
    };
  }

  getRecord() {
    const id = this.state.id;
    if (id !== -1) {
      axios
        .post("/doctor/records/", {
          rid: id,
        })
        .then((result) => {
          const {
            date,
            doc_fname,
            doc_lname,
            dob,
            gender,
            id,
            observation,
            pat_fname,
            pat_lname,
            prescription,
            private_note,
          } = result.data.res.data;

          const docName = doc_fname + " " + doc_lname;
          const patName = pat_fname + " " + pat_lname;
          const diseases = result.data.res.diseases.map(
            (element) => element.disease
          );

          this.setState({
            id: id,
            patName: patName,
            docName: docName,
            dob: dob,
            gender: gender,
            date: date,
            prescription: prescription,
            observation: observation,
            private_note: private_note,
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
      return <Redirect to="/d/records" />;
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
      private_note,
      disease,
    } = this.state;

    return (
      <div className="record-view-wrapper">
        <div className="record-view-header">
          <h2 className="record-view-title">Medical Record #{id}</h2>
          <span className="record-view-date">Date: {date}</span>
          <Link
            to={{
              pathname: "pdf",
              state: { data: this.state },
            }}
          >
            <button className="record-view-pdf-btn">
              <img src={pdfIcon} alt="Export PDF" />
            </button>
          </Link>
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
            <textarea
              className="record-card-scroll"
              readOnly={true}
              value={prescription}
            />
          </div>
          <div className="record-card">
            <h4>Observations</h4>
            <textarea
              className="record-card-scroll"
              readOnly={true}
              value={observation}
            />
          </div>
          <div className="record-card">
            <h4>Private Notes</h4>
            <textarea
              className="record-card-scroll"
              readOnly={true}
              value={private_note}
            />
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

export default DocView;
