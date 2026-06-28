import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import NavBar from "./navbar.jsx";
import UpperBar from "../upper-bar.jsx";
import DocProfile from "./profile";
import DocEdit from "./edit-profile";
import DocRecords from "./records.jsx";
import PatList from "./patientsList.jsx";
import DocView from "./view-record.jsx";
import Add from "./add-records.jsx";
import DisList from "./DisList.jsx";
import Viz from "./viz";
import Pdf from "./pdf";
import Dashboard from "../dashboard";

class Doctor extends Component {
  render() {
    return (
      <Switch>
        <Route path="/d/pdf" component={Pdf} />
        <React.Fragment>
          <div className={"row no-gutters"}>
            <div className={"col-sm-2 no-gutters"}>
              <div className={"leftside"}>
                <NavBar />
              </div>
            </div>
            <div className={"col-sm-10 no-gutters"}>
              <div className={"rightside"}>
                <UpperBar />
                <Route
                  path="/d/dashboard"
                  render={() => (
                    <Dashboard
                      endpoint="/doctor/dashboard"
                      title="Doctor Dashboard"
                      subtitle="Your patient records, recent diagnoses, and clinical workload."
                      metrics={[
                        { key: "patients", label: "Patients", icon: "personal_injury" },
                        { key: "records", label: "Records", icon: "assignment" },
                        { key: "recent_diagnoses", label: "Diagnoses", icon: "monitor_heart" },
                      ]}
                    />
                  )}
                />
                <Route path="/d/dis" component={DisList} />
                <Route path="/d/profile" component={DocProfile} />
                <Route path="/d/edit-profile" component={DocEdit} />
                <Route path="/d/add-records" component={Add} />
                <Route path="/d/records" component={DocRecords} />
                <Route path="/d/patList" component={PatList} />
                <Route path="/d/view-record" component={DocView} />
                <Route path="/d/viz" component={Viz} />
              </div>
            </div>
          </div>
        </React.Fragment>
      </Switch>
    );
  }
}

export default Doctor;
