import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Jumbotron from "react-bootstrap/Jumbotron";
import "./MyPool.css";
import Navbar from "../Navbar/Navbar";
import { serverIp, serverPort } from "../config";
const hostAddress= "" + serverIp + ":" + serverPort + "";
let createPool;

class MyPool extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      obj: [],
      newId: "",
      poolName: "",
      poolDescription: "",
      poolLeader: "",
      poolStreet: "",
      poolCity: "",
      poolState: "",
      poolZip: "",
      poolMembers: [],
      createPoolStatus: "",
      nameError: "",
      addressError: "",
      idError: "",
      createdMsg: "",
      deleteMsg: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleCreatePool = this.handleCreatePool.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleDelete = e => {
    console.log("inside delete");

    let data = {
      email: localStorage.getItem("email"),
      name: this.state.poolName
    };
    console.log("name is " + this.state.poolName);
    console.log("email is " + this.state.email);
    axios
      .post(hostAddress + "/deletePool", data)
      .then(response => {
        console.log("response is " + response.data);
        if (response.data == "cannot delete") {
          this.setState({
            deleteMsg: "Can not delete! Other pool members also exist!"
          });
        } else if (response.data == "deleted") {
          this.setState({
            deleteMsg: "Pool Deleted. Refresh to see changes."
          });
        } else if (response.data == "no authority") {
          this.setState({
            deleteMsg: "User does not has the authority to delete the pool."
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  handleUpdate = e => {
    let data = {
      newId: this.state.newId,
      name: this.state.poolName,
      description: this.state.poolDescription
    };
    axios
      .post(hostAddress + "/updatePool", data)
      .then(response => {
        //console.log("response is " + response.data);
        if (response.data == "Pool name required") {
          this.setState({
            nameError: "Pool name required"
          });
        } else if (response.data == "Pool name exists") {
          this.setState({
            nameError: "Pool name exists"
          });
        } else if (response.data == "Pool updated") {
          this.setState({
            createdMsg: "Pool updated!"
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  handleCreatePool = e => {
    let data = {
      email: localStorage.getItem("email"),
      newId: this.state.newId,
      name: this.state.poolName,
      description: this.state.poolDescription,
      street: this.state.poolStreet,
      city: this.state.poolCity,
      state: this.state.poolState,
      zip: this.state.poolZip
    };
    this.setState({
      nameError: "",
      addressError: "",
      idError: ""
    });
    console.log("data going is " + data);
    axios
      .post(hostAddress + "/createPool", data)
      .then(response => {
        console.log("response is " + response.data);
        if (response.data == "PoolID required") {
          this.setState({
            idError: "PoolID required"
          });
        } else if (response.data == "PoolID already exists") {
          this.setState({
            idError: "PoolID already exists"
          });
        } else if (response.data == "name exists") {
          this.setState({
            nameError: "Pool Name already exists"
          });
        } else if (response.data == "Pool name required") {
          this.setState({
            nameError: "Pool name required"
          });
        } else if (response.data == "Address is required.") {
          this.setState({
            addressError: "Address is required."
          });
        } else if (response.data == "created") {
          this.setState({
            createdMsg: "Your Pool has been created. Refresh to see details."
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  handleCreate = e => {
    //console.log("inside handle create");
    this.setState({
      createPoolStatus: "yes"
    });
  };
  componentDidMount() {
    this.setState({
      status: "",
      createPoolStatus: ""
    });
    axios
      .post(hostAddress + "/getPool", {
        email: localStorage.getItem("email")
      })
      .then(response => {
        //console.log("response is " + response.data);
        if (response.data == "create") {
          this.setState({
            status: "create"
          });
        } else {
          console.log("response is " + response.data);
          localStorage.setItem("pool", response.data.poolId);
          this.setState({
            newId: response.data.newId,
            poolName: response.data.name,
            poolDescription: response.data.description,
            poolLeader: response.data.poolLeader,
            poolStreet: response.data.address.street,
            poolCity: response.data.address.city,
            poolState: response.data.address.state,
            poolZip: response.data.address.zip,
            poolMembers: response.data.members
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    let details;
    let member_details;
    if (this.state.createPoolStatus == "yes") {
      createPool = (
        <Card style={{ width: "40rem", marginLeft: "25rem" }}>
          <br></br>
          <div style={{ marginLeft: "5rem" }}>
            <br></br>
            <h4 style={{ marginLeft: "5rem" }}>Add your new pool details.</h4>
            <br></br>

            <Form style={{ width: "30rem" }}>
              <Form.Group controlId="Name">
                <Row>
                  <Col>
                    <Form.Label>Pool ID</Form.Label>
                    <Form.Control
                      placeholder="poolID"
                      name="newId"
                      defaultValue={this.state.newId}
                      onChange={this.handleChange}
                    />
                    <Form.Text style={{ color: "#FF0000" }}>
                      {this.state.idError}
                    </Form.Text>
                  </Col>
                  <Col>
                    <Form.Label>Pool Name</Form.Label>
                    <Form.Control
                      required
                      placeholder="poolName"
                      name="poolName"
                      onChange={this.handleChange}
                      //defaultValue={this.state.poolName}
                    />
                    <Form.Text style={{ color: "#FF0000" }}>
                      {this.state.nameError}
                    </Form.Text>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group controlId="poolDescription">
                <Form.Label>Pool Description</Form.Label>
                <Form.Control
                  required
                  placeholder="poolDescription"
                  name="poolDescription"
                  onChange={this.handleChange}
                  //defaultValue={this.state.poolDescription}
                />
              </Form.Group>
              <Form.Group controlId="address">
                <Row>
                  <Col>
                    <Form.Label>Pool Street</Form.Label>
                    <Form.Control
                      required
                      placeholder="poolStreet"
                      name="poolStreet"
                      onChange={this.handleChange}
                      //defaultValue={this.state.poolStreet}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Pool City</Form.Label>
                    <Form.Control
                      required
                      onChange={this.handleChange}
                      placeholder="poolCity"
                      name="poolCity"
                      //defaultValue={this.state.poolCity}
                    />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col>
                    <Form.Label>Pool State</Form.Label>
                    <Form.Control
                      required
                      onChange={this.handleChange}
                      placeholder="poolState"
                      name="poolState"
                      //defaultValue={this.state.poolState}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Pool Zip</Form.Label>
                    <Form.Control
                      required
                      onChange={this.handleChange}
                      placeholder="poolZip"
                      name="poolZip"
                      //defaultValue={this.state.poolZip}
                    />
                  </Col>
                </Row>
              </Form.Group>

              <br />
              <center>
                <Button
                  className="buttonButton"
                  onClick={this.handleCreatePool}
                >
                  Create a new Pool
                </Button>
                <br />
                <br />
                <span style={{ color: "#FF0000" }}>
                  {this.state.addressError}
                </span>
                <span> {this.state.createdMsg}</span>
              </center>
            </Form>
          </div>
          <br></br>

          <br></br>
          <br></br>
        </Card>
      );
    }

    if (this.state.poolMembers != []) {
      console.log("there are members");
      member_details = this.state.poolMembers.map(result => {
        return (
          <div>
            <Row style={{ width: "30rem", marginLeft: "0rem" }}>
              <Form.Control readOnly value={result.screenName} />
            </Row>
            <br />
          </div>
        );
      });
    }
    if (this.state.status == "create") {
      details = (
        <div>
          <Card style={{ width: "40rem", marginLeft: "25rem" }}>
            <br></br>
            <br></br>
            <center>
              <h4>You are not member of any Pool yet! </h4>
              <br></br>
              <h4>Create your own Pool. </h4>
              <br></br>

              <div>
                <Form>
                  <Form.Group controlId="create">
                    <Button
                      className="buttonButton"
                      onClick={this.handleCreate}
                    >
                      Create
                    </Button>
                  </Form.Group>
                  <br />
                </Form>
              </div>
            </center>
          </Card>
          <br />
          <br />
          {createPool}
        </div>
      );
    } else {
      //console.log("response from render is " + this.state.poolName);
      details = (
        <Card style={{ width: "40rem", marginLeft: "25rem" }}>
          <br></br>
          <div style={{ marginLeft: "5rem" }}>
            <br></br>
            <h4 style={{ marginLeft: "5rem" }}>
              Following are your Pool Details!
            </h4>
            <br></br>

            <Form style={{ width: "30rem" }}>
              <Form.Group controlId="Name">
                <Row>
                  <Col>
                    <Form.Label>Pool ID</Form.Label>
                    <Form.Control
                      readOnly
                      placeholder="poolID"
                      name="newId"
                      defaultValue={this.state.newId}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Pool Name</Form.Label>
                    <Form.Control
                      required
                      placeholder="poolName"
                      name="poolName"
                      onChange={this.handleChange}
                      defaultValue={this.state.poolName}
                    />
                    <Form.Text style={{ color: "#FF0000" }}>
                      {this.state.nameError}
                    </Form.Text>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group controlId="poolLeader">
                <Form.Label>Pool Leader</Form.Label>
                <Form.Control
                  readOnly
                  placeholder="poolLeader"
                  name="poolLeader"
                  defaultValue={this.state.poolLeader}
                />
              </Form.Group>
              <Form.Group controlId="poolDescription">
                <Form.Label>Pool Description</Form.Label>
                <Form.Control
                  required
                  placeholder="poolDescription"
                  name="poolDescription"
                  onChange={this.handleChange}
                  defaultValue={this.state.poolDescription}
                />
              </Form.Group>
              <Form.Group controlId="address">
                <Row>
                  <Col>
                    <Form.Label>Pool Street</Form.Label>
                    <Form.Control
                      readOnly
                      placeholder="poolStreet"
                      name="poolStreet"
                      defaultValue={this.state.poolStreet}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Pool City</Form.Label>
                    <Form.Control
                      readOnly
                      placeholder="poolCity"
                      name="poolCity"
                      defaultValue={this.state.poolCity}
                    />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col>
                    <Form.Label>Pool State</Form.Label>
                    <Form.Control
                      readOnly
                      placeholder="poolState"
                      name="poolState"
                      defaultValue={this.state.poolState}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Pool Zip</Form.Label>
                    <Form.Control
                      readOnly
                      placeholder="poolZip"
                      name="poolZip"
                      defaultValue={this.state.poolZip}
                    />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group controlId="poolMembers">
                <Form.Label>Pool Members</Form.Label>
                {member_details}
              </Form.Group>
              <br />
              <center>
                <Button className="buttonButton" onClick={this.handleUpdate}>
                  Update!
                </Button>
                <br />
                <br />
                <span> {this.state.createdMsg}</span>
                <br />
                Do you wanna delete this Pool?
                <br />
                <br />
                <Button className="buttonButton" onClick={this.handleDelete}>
                  YES
                </Button>
                <br />
                <br />
                <span> {this.state.deleteMsg}</span>
              </center>
            </Form>
          </div>
          <br></br>

          <br></br>
          <br></br>
        </Card>
      );
    }
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
      <div className="mainDiv">
        {redirectVar}
        <Navbar />
        <div className="leftalign">
          <Jumbotron>
            <h1>My Pool</h1>
          </Jumbotron>
          <br></br>
          <br></br>
          {details}
        </div>
      </div>
    );
  }
}

export default MyPool;
