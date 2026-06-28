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
    };
  }

  getDiseases = () => {
    return new Promise((resolve, reject) => {
      axios
        .post("/admin/disease-list", {
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

  componentDidMount() {
    this.getDiseases().then((res) => {
      const { total, records } = res.data.response;
      const data = records.map((d, idx) => {
        return { name: d.disease, id: idx + this.state.offset + 1 };
      });
      this.setState({
        diseases: data.slice(),
        total: total["count"],
      });
    });
  }

  setDisease = () => {
    this.getDiseases().then((res) => {
      const { total, records } = res.data.response;
      const data = records.map((d, idx) => {
        return { name: d.disease, id: idx + this.state.offset + 1 };
      });
      this.setState({
        diseases: data.slice(),
        total: total["count"],
        name: "",
      });
    });
  };

  addDisease = (e) => {
    e.preventDefault();
    axios
      .post("/admin/disease", {
        disease: this.state.name,
      })
      .then((res) => {
        this.setDisease();
      });
  };

  nextHandle = () => {
    if (this.state.offset + this.state.limit < this.state.total) {
      this.setState(
        { offset: this.state.offset + this.state.limit },
        () => { this.setDisease(); }
      );
    }
  };

  prevHandle = () => {
    if (this.state.offset !== 0) {
      this.setState(
        { offset: this.state.offset - this.state.limit },
        () => { this.setDisease(); }
      );
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

        <table className="table table-hover">
          <caption>
            Showing {this.state.offset + 1} –{" "}
            {this.state.offset + this.state.diseases.length} of{" "}
            {this.state.total}
          </caption>
          <thead className="bg-primary table-dark">
            <tr>
              <th>#</th>
              <th>Disease Name</th>
            </tr>
          </thead>
          <tbody className="table-light">
            {this.state.diseases.map((disease) => (
              <tr key={disease.id}>
                <td>{disease.id}</td>
                <td>{disease.name}</td>
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
