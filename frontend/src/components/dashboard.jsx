import React from "react";
import axios from "axios";
import "./css/dashboard.css";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: "",
      data: null,
    };
  }

  componentDidMount() {
    axios
      .get(this.props.endpoint)
      .then((res) => {
        this.setState({ loading: false, data: res.data.data || {} });
      })
      .catch(() => {
        this.setState({
          loading: false,
          error: "Dashboard data is unavailable right now.",
        });
      });
  }

  renderMetric(label, value, icon) {
    return (
      <article className="dashboard-metric" key={label}>
        <span className="material-icons dashboard-metric-icon">{icon}</span>
        <div>
          <p>{label}</p>
          <strong>{value || 0}</strong>
        </div>
      </article>
    );
  }

  renderRecentItem(item) {
    const patient = [item.pat_fname, item.pat_lname].filter(Boolean).join(" ") || "Patient";
    const doctor = [item.doc_fname, item.doc_lname].filter(Boolean).join(" ");

    return (
      <li className="dashboard-activity-item" key={item.id}>
        <span className="material-icons">description</span>
        <div>
          <strong>{patient}</strong>
          <p>
            {doctor ? `Care by Dr. ${doctor}` : "Recent medical record"}
            {item.date ? ` • ${item.date}` : ""}
          </p>
        </div>
      </li>
    );
  }

  renderSkeleton() {
    return (
      <div className="dashboard-grid">
        {[1, 2, 3, 4].map((item) => (
          <div className="dashboard-skeleton" key={item} />
        ))}
      </div>
    );
  }

  render() {
    const { title, subtitle, metrics } = this.props;
    const { loading, error, data } = this.state;
    const totals = data && data.totals ? data.totals : {};
    const activity = (data && (data.recentRecords || data.upcomingWork)) || [];

    return (
      <main className="dashboard-page">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-kicker">EMRS Command Center</p>
            <h1>{title}</h1>
            <span>{subtitle}</span>
          </div>
          <div className="dashboard-mode-pill">
            <span className="material-icons">verified_user</span>
            Protected workspace
          </div>
        </header>

        {loading ? (
          this.renderSkeleton()
        ) : error ? (
          <div className="dashboard-alert">{error}</div>
        ) : (
          <>
            <section className="dashboard-grid">
              {metrics.map((metric) =>
                this.renderMetric(metric.label, totals[metric.key], metric.icon)
              )}
            </section>

            <section className="dashboard-panel">
              <div className="dashboard-panel-header">
                <h2>Recent Activity</h2>
                <span>{activity.length} updates</span>
              </div>
              {activity.length > 0 ? (
                <ul className="dashboard-activity-list">
                  {activity.map((item) => this.renderRecentItem(item))}
                </ul>
              ) : (
                <p className="dashboard-empty">No recent records to display.</p>
              )}
            </section>
          </>
        )}
      </main>
    );
  }
}

export default Dashboard;
