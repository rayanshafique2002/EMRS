import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import NavBar from "./navbar.jsx";
import UpperBar from "../upper-bar.jsx";

import DocAccounts from "./doc-accounts";
import AddDocAccounts from "./add-doc-account";
import EditDocAccount from "./edit-doc-account";
import ListDiseases from "./list-diseases";
import AdminPatients from "./patients";
import AdminRecords from "./records";
import AdminView from "./view-record";
import Dashboard from "../dashboard";

class Admin extends Component {
  render() {
    return (
      <div className={"row no-gutters"}>
        <div className={"col-sm-2 no-gutters"}>
          <div className={"leftside"}>
            <NavBar />
          </div>
        </div>
        <div className={"col-sm-10 no-gutters"}>
          <div className={"rightside"}>
            <UpperBar />
            <Switch>
              <Route
                path="/a/dashboard"
                render={() => (
                  <Dashboard
                    endpoint="/admin/dashboard"
                    title="Admin Dashboard"
                    subtitle="Hospital-wide records, doctors, patients, and clinical activity."
                    metrics={[
                      { key: "patients", label: "Patients", icon: "personal_injury" },
                      { key: "doctors", label: "Doctors", icon: "medical_services" },
                      { key: "records", label: "Records", icon: "assignment" },
                      { key: "diseases", label: "Diseases", icon: "analytics" },
                    ]}
                  />
                )}
              />
              <Route path="/a/doc-accounts" component={DocAccounts} />
              <Route path="/a/add-doc-account" component={AddDocAccounts} />
              <Route path="/a/edit-doc-account" component={EditDocAccount} />
              <Route path="/a/list-diseases" component={ListDiseases} />
              <Route path="/a/patients" component={AdminPatients} />
              <Route path="/a/records" component={AdminRecords} />
              <Route path="/a/view-record" component={AdminView} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default Admin;
