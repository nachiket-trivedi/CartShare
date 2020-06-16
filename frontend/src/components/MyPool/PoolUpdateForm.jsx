import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

class PoolUpdateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: "False",
      msg: ""
    };

    this.handleChange = this.handleChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillMount() {
    this.setState({
      poolID: this.props.poolID,
      poolName: this.props.poolName,
      poolDescription: this.props.poolDescription
    });
    console.log("inside update form");
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    const { poolID, poolName, poolDescription } = this.state;
    let redirectVar = null;
    let email = localStorage.getItem("email");
    console.log("email is " + email);
    if (
      localStorage.getItem("email") == null ||
      localStorage.getItem("role") == "Admin"
    ) {
      redirectVar = <Redirect to="/login" />;
    }
    return (
      <div>
        {redirectVar}
        <form
          className="needs-validation container novalidate content-form-padding"
          //onSubmit={this.handleSubmit}
        >
          <div>
            <div className="form-row"></div>
            <div className="form-row form-group">
              <div className="col-md-6 ">
                <label htmlFor="inputPoolID">Pool ID</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  name="poolID"
                  className="form-control"
                  id="poolID"
                  placeholder="Pool ID"
                  defaultValue={poolID}
                  required
                />
                <div className="invalid-feedback">Pool ID is Required.</div>
              </div>
              <div className="col-md-6 ">
                <label htmlFor="inputPoolName">Pool name</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  name="poolName"
                  className="form-control"
                  id="poolName"
                  placeholder="Pool name"
                  defaultValue={poolName}
                  required
                />
                <div className="invalid-feedback">Pool Name is Required.</div>
              </div>
              <br />
              <br />
              <div className="col-md-12 ">
                <label htmlFor="inputDescription">Description</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  name="poolDescription"
                  className="form-control"
                  id="poolDescription"
                  placeholder="Pool Description"
                  defaultValue={poolDescription}
                  required
                />
                <div className="invalid-feedback">
                  Pool Description is Required.
                </div>
              </div>
              <br />
              <br />
            </div>

            <div className="form-row">
              <button type="submit" className="btn btn-primary">
                Save
              </button>
              <div> {} </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
export default PoolUpdateForm;
