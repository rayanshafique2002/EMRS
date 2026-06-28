import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Profile from "./profile.jsx";
import NavBar from "./navbar.jsx";
import UpperBar from "../upper-bar.jsx";
import Edit from "./edit-profile.jsx";
import Records from "./records";
import View from "./view-record";
import Pdf from "./pdf";
import Dashboard from "../dashboard";

class Patient extends Component {
  render() {
    return (
      <Switch>
        <Route path="/p/pdf" component={Pdf} />
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
                  path="/p/dashboard"
                  render={() => (
                    <Dashboard
                      endpoint="/patient/dashboard"
                      title="Patient Dashboard"
                      subtitle="Your medical records, care team, diagnoses, and recent prescriptions."
                      metrics={[
                        { key: "records", label: "Records", icon: "assignment" },
                        { key: "doctors", label: "Doctors", icon: "medical_services" },
                        { key: "diagnoses", label: "Diagnoses", icon: "monitor_heart" },
                      ]}
                    />
                  )}
                />
                <Route path="/p/profile" component={Profile} />
                <Route path="/p/edit-profile" component={Edit} />
                <Route path="/p/records" component={Records} />
                <Route path="/p/view-record" component={View} />
              </div>
            </div>
          </div>
        </React.Fragment>
      </Switch>
    );
  }
}

export default Patient;
