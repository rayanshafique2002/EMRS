import React from "react";
import axios from "axios";

class ListDiseases extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diseases: [],
      offset: 0,
      limit: 5,
      total: 0,
      name: "",
      editingId: null,
      editName: "",
      message: "",
    };
  }

  getDiseases = () => {
    return axios.post("/admin/disease-list", { offset: this.state.offset });
  };

  loadDiseases = () => {
    return this.getDiseases().then((res) => {
      const { total, records } = res.data.response;
      const data = records.map((d) => ({ id: d.id, name: d.disease }));
      this.setState({
        diseases: data,
        total: total["count"],
        name: "",
        editingId: null,
        editName: "",
        message: "",
      });
    });
  };

  componentDidMount() {
    this.loadDiseases();
  }

  addDisease = (e) => {
    e.preventDefault();
    if (!this.state.name.trim()) {
      this.setState({ message: "Enter a disease name" });
      return;
    }
    axios
      .post("/admin/disease", { disease: this.state.name })
      .then(() => {
        this.loadDiseases();
      })
      .catch((err) => {
        this.setState({ message: this.errorMessage(err, "Failed to add disease") });
      });
  };

  startEdit = (disease) => {
    this.setState({ editingId: disease.id, editName: disease.name, message: "" });
  };

  cancelEdit = () => {
    this.setState({ editingId: null, editName: "" });
  };

  saveEdit = () => {
    if (!this.state.editName.trim()) {
      this.setState({ message: "Enter a disease name" });
      return;
    }
    axios
      .post("/admin/disease/update", {
        id: this.state.editingId,
        name: this.state.editName,
      })
      .then(() => {
        this.loadDiseases();
      })
      .catch((err) => {
        this.setState({ message: this.errorMessage(err, "Failed to update disease") });
      });
  };

  deleteDisease = (id) => {
    axios
      .post("/admin/disease/delete", { id: id })
      .then(() => {
        // If we removed the last item on a page, step back a page.
        const remaining = this.state.diseases.length - 1;
        if (remaining === 0 && this.state.offset >= this.state.limit) {
          this.setState({ offset: this.state.offset - this.state.limit }, () => {
            this.loadDiseases();
          });
        } else {
          this.loadDiseases();
        }
      })
      .catch((err) => {
        this.setState({ message: this.errorMessage(err, "Failed to delete disease") });
      });
  };

  errorMessage = (err, fallback) => {
    return (err.response && err.response.data && err.response.data.message) || fallback;
  };

  nextHandle = () => {
    if (this.state.offset + this.state.limit < this.state.total) {
      this.setState({ offset: this.state.offset + this.state.limit }, () => {
        this.loadDiseases();
      });
    }
  };

  prevHandle = () => {
    if (this.state.offset !== 0) {
      this.setState({ offset: this.state.offset - this.state.limit }, () => {
        this.loadDiseases();
      });
    }
  };

  InputHandle = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    return (
      <div className="list-container">
        <div className="disease-add-row">
          <div>
            <label htmlFor="name">Disease Name</label>
            <input
              type="text"
              id="name"
              value={this.state.name}
              onChange={this.InputHandle}
              placeholder="Enter disease name"
            />
          </div>
          <button
            className="btn btn-outline-primary btn-sm"
            style={{ height: "40px", padding: "0 20px" }}
            onClick={this.addDisease}
          >
            Add
          </button>
        </div>

        {this.state.message && (
          <div className="alert alert-danger">{this.state.message}</div>
        )}

        <table className="table table-hover">
          <caption>
            Showing {this.state.offset + 1} –{" "}
            {this.state.offset + this.state.diseases.length} of {this.state.total}
          </caption>
          <thead className="bg-primary table-dark">
            <tr>
              <th>#</th>
              <th>Disease Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="table-light">
            {this.state.diseases.map((disease, idx) => (
              <tr key={disease.id}>
                <td>{this.state.offset + idx + 1}</td>
                <td>
                  {this.state.editingId === disease.id ? (
                    <input
                      type="text"
                      id="editName"
                      value={this.state.editName}
                      onChange={this.InputHandle}
                    />
                  ) : (
                    disease.name
                  )}
                </td>
                <td>
                  {this.state.editingId === disease.id ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        style={{ marginRight: "8px" }}
                        onClick={this.saveEdit}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={this.cancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        style={{ marginRight: "8px" }}
                        onClick={() => this.startEdit(disease)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => this.deleteDisease(disease.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pag-controls">
          <button className="pag-btn" onClick={this.prevHandle}>
            &#8249;
          </button>
          <button className="pag-btn" onClick={this.nextHandle}>
            &#8250;
          </button>
        </div>
      </div>
    );
  }
}

export default ListDiseases;
