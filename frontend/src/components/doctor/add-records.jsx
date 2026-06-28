import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import DisList from "./DisList";
import "../css/records-styles.css";

class Add extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pat_id: 0,
      patName: "",
      docName: "",
      dob: "",
      gender: "",
      today: "",
      prescription: "",
      observations: "",
      priv_notes: "",
      diseases: [],
      diseaseList: [],
      loading: true,
      redirect: false,
    };
  }

  getInformation() {
    axios
      .post("/doctor/recordinfo", { pat_id: this.state.pat_id })
      .then((res) => {
        const response = res.data.data;

        let disList = [];
        response.diseases.map((e) => {
          return disList.push(Object.values(e)[0]);
        });

        const { pat_fname, pat_lname, gender, dob } = response.pat;
        const patName = pat_fname + " " + pat_lname;

        const { doc_fname, doc_lname } = response.doc;
        const docName = doc_fname + " " + doc_lname;

        let present = new Date();
        const year = present.getFullYear();
        let month = present.getMonth() + 1;
        let date = present.getDate();

        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;

        const today = year + "-" + month + "-" + date;

        this.setState({
          diseaseList: disList.sort(),
          patName: patName,
          docName: docName,
          dob: dob,
          gender: gender,
          today: today,
          loading: false,
        });
      });
  }

  updateDiseases = (selections) => {
    const dis = [];
    selections.forEach((v) => dis.push(v.value));
    this.setState({ diseases: dis });
  };

  componentDidMount() {
    if (this.props.location.state) {
      const { id } = this.props.location.state;
      this.setState({ pat_id: id }, () => {
        this.getInformation();
      });
    } else {
      this.setState({ pat_id: -1 });
    }
  }

  InputHandle = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  ClickHandle = (e) => {
    e.preventDefault();

    axios
      .post("/doctor/newrecord", {
        date: this.state.today,
        observation: this.state.observations,
        prescription: this.state.prescription,
        private_note: this.state.priv_notes,
        pat_id: this.state.pat_id,
        disease: this.state.diseases,
      })
      .then((res) => {
        this.setState({ redirect: true });
      });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/d/patList" />;
    }

    return (
      <div className="add-record-wrapper">
        <div className="add-record-header">
          <h2 className="add-record-title">New Medical Record</h2>
          <span className="add-record-date">Date: {this.state.today}</span>
        </div>

        <div className="record-meta-row">
          <div className="record-meta-field">
            <span className="record-meta-value">{this.state.patName}</span>
            <span className="record-meta-label">Patient</span>
          </div>
          <div className="record-meta-field">
            <span className="record-meta-value">{this.state.dob}</span>
            <span className="record-meta-label">DOB</span>
          </div>
          <div className="record-meta-field">
            <span className="record-meta-value">{this.state.gender}</span>
            <span className="record-meta-label">Gender</span>
          </div>
          <div className="record-meta-field">
            <span className="record-meta-value">{this.state.docName}</span>
            <span className="record-meta-label">Doctor</span>
          </div>
        </div>

        <div className="add-record-cards-row">
          <div className="add-record-card">
            <h4>Prescription</h4>
            <textarea
              id="prescription"
              onChange={this.InputHandle}
              placeholder="Enter prescription details..."
            />
          </div>
          <div className="add-record-card">
            <h4>Observations</h4>
            <textarea
              id="observations"
              onChange={this.InputHandle}
              placeholder="Enter clinical observations..."
            />
          </div>
          <div className="add-record-card">
            <h4>Private Notes</h4>
            <textarea
              id="priv_notes"
              onChange={this.InputHandle}
              placeholder="Enter private notes..."
            />
          </div>
          <div className="add-record-card">
            <h4>Disease(s)</h4>
            <DisList
              diseases={this.state.diseaseList}
              loading={this.state.loading}
              updateDiseases={this.updateDiseases}
            />
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <button
            type="button"
            className="btn-emrs-save"
            onClick={this.ClickHandle}
          >
            Save Record
          </button>
        </div>
      </div>
    );
  }
}

export default Add;
