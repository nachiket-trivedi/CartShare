import React, { Component } from "react";
import { Col, Row, Container, ListGroup } from "react-bootstrap";
import "./AdminStores.css";
import axios from "axios";
import { Redirect } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { serverIp, serverPort } from "../config";
const hostAddress= "" + serverIp + ":" + serverPort + "";
class AddStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storeName: "",
      streetName: "",
      city: "",
      state: "",
      zipcode: ""
    };

    this.addStore = this.addStore.bind(this);
    this.clearStore=this.clearStore.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
  }

  addStore = () => {
   
   const data={
    name: this.state.storeName,
    street: this.state.streetName,
    city: this.state.city,
    state: this.state.state,
    zip: this.state.zipcode
   } 

   axios.defaults.withCredentials = false;
    axios
      .post(hostAddress + "/addStore", data)
      .then(response => {
       // alert(response.status);
          console.log("Response data after add Store post-->" + response.data);
          alert("Store Added Successfully!");
       window.location.reload();
      })
      .catch(err => {
        console.log(err.status);
        alert(err.response.data["error"]);
      });
  }

  clearStore = () => {
    window.location.reload();
  }

  componentDidMount = () => {
    //Write code to retrieve all stores?
  };

  inputChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    let displayDetails = null;
    let redirectVar=null;
    if (localStorage.getItem("role") == "Admin") {
      if (localStorage.getItem("verified") != "true") {
        redirectVar = <Redirect to="/notVerified" />;
      } 
    } else if (localStorage.getItem("role") == "Pooler") {
     
        redirectVar = <Redirect to="/home" />;
    }
    return (
      <div className="addForm">
        {redirectVar}
        <Container>
          <h5>Add Store</h5>
          <Form>
            <Form.Row>
              <Form.Control
                placeholder="Store Name"
                name="storeName"
                id="storeName"
                required
                onChange={this.inputChangeHandler.bind(this)}
              />
            </Form.Row>
            <br></br>
            <Form.Row>
              <Form.Control
                placeholder="Street Name and Number"
                name="streetName"
                id="streetName"
                required
                onChange={this.inputChangeHandler.bind(this)}
              />
            </Form.Row>
            <br></br>
            <Form.Row>
              <Col>
                <Form.Control
                  placeholder="City"
                  name="city"
                  id="city"
                  required
                  onChange={this.inputChangeHandler.bind(this)}
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="State"
                  name="state"
                  id="state"
                  required
                  onChange={this.inputChangeHandler.bind(this)}
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="Zipcode"
                  name="zipcode"
                  id="zipcode"
                  required
                  onChange={this.inputChangeHandler.bind(this)}
                />
              </Col>
            </Form.Row>
            <br></br>
            <span>
              <Button className="buttonButton" onClick={this.addStore.bind(this)}>Add</Button>
            </span>
            <span>
              <Button className="cancelButton" onClick={this.clearStore}>Clear</Button>
            </span>
          </Form>
        </Container>
      </div>
    );
  }
}

export default AddStore;
