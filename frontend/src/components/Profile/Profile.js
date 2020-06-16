import React, { useState, Profiler } from "react";
import { Redirect } from "react-router";
import classnames from "classnames";
//import Navbar from "../Navbar/Navbar";
import HoriNavbar from "../Navbar/HorizontalNav";
import Navbar from "../Navbar/Navbar";
import "./Profile.css";
import axios from "axios";
import {
  Jumbotron,
  Media,
  Container,
  ButtonGroup,
  Row,
  Col,
  Button,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";

import { serverIp, serverPort } from "../config";
const hostAddress= "" + serverIp + ":" + serverPort + "";
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: localStorage.getItem("email"),
      screenName: "",
      nickName: "",
      street: "",
      phoneNumber: "",
      city: "",
      state: "",
      zipcode: "",
      password: "",
      newPassword: "",
      editFlag: false
    };

    this.updatePage = this.updatePage.bind(this);
    this.saveForm = this.saveForm.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
  }

  componentDidMount() {
    axios.defaults.withCredentials = false;
    axios
      .get(hostAddress + "/getUser", {
        params: {
          email: localStorage.getItem("email")
        }
      })
      .then(response => {
        //alert(response.status);
        console.log("Response data after login post-->" + response.data);

        var street1 = "",
          city1 = "",
          state1 = "",
          zipcode1 = "";

        if (response.data.User.address != null) {
          street1 = response.data.User.address.street;
          state1 = response.data.User.address.state;
          city1 = response.data.User.address.city;
          zipcode1 = response.data.User.address.zip;
        }
        //  alert("Hi")
        this.setState({
          screenName: response.data.User["screenName"],
          nickName: response.data.User["nickname"],
          state: state1,
          city: city1,
          street: street1,
          zipcode: zipcode1,
          phoneNumber: response.data.User["phoneNumber"]
        });

        // window.location.reload();
      })
      .catch(err => {
        console.log(err.status);
        alert(err.data);
      });
  }

  inputChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  updatePage = e => {
    this.setState({
      editFlag: true
    });
  };

  saveForm = e => {
    const data = {
      email: this.state.email,
      nickName: this.state.nickName,
      screenName: this.state.screenName,
      password: this.state.password,
      street: this.state.street,
      city: this.state.city,
      state: this.state.state,
      zipcode: this.state.zipcode,
      mobile: this.state.phoneNumber
    };
    localStorage.setItem("state", this.state.state);
    localStorage.setItem("city", this.state.city);
    localStorage.setItem("street", this.state.street);
    localStorage.setItem("zipcode", this.state.zipcode);
    console.log(data);
    var street1 = "",
      city1 = "",
      state1 = "",
      zipcode1 = "";
    axios.defaults.withCredentials = false;
    axios
      .put(hostAddress + "/updateUser", data)
      .then(response => {
        //alert(response.status);
        if (response.data.User.address != null) {
          street1 = response.data.User.address.street;
          state1 = response.data.User.address.state;
          city1 = response.data.User.address.city;
          zipcode1 = response.data.User.address.zip;
        }

        this.setState({
          screenName: response.data.User["screenName"],
          nickName: response.data.User["nickname"],
          state: state1,
          city: city1,
          street: street1,
          zipcode: zipcode1,
          phoneNumber: response.data.User["phoneNumber"]
        });

        window.location.reload();
      })
      .catch(err => {
        console.log(err.status);
        alert(err.response.data["error"]);
      });

    this.setState({
      editFlag: false
    });
  };

  render() {
    let redirectVar = null;

    if (localStorage.getItem("verified") == "false") {
      redirectVar = <Redirect to="/notVerified" />;
    }

    let personalProfileDetails = null;
    if (this.state.editFlag == false) {
      personalProfileDetails = (
        <div>
          <br></br>
          <Row>
            <Col>
              <i
                class="fas fa-user"
                style={{
                  margin: "10px 10px 20px 0px",
                  fontSize: "1.2rem",
                  color: "rgb(7, 107, 146)"
                }}
              ></i>
              <b>Screen Name</b> {this.state.screenName}
            </Col>
            <Col>
              <i
                class="fas fa-key"
                style={{
                  margin: "10px 10px 20px 0px",
                  fontSize: "1.2rem",
                  color: "rgb(7, 107, 146)"
                }}
              ></i>
              <b>Nickname</b> {this.state.nickName}
            </Col>
          </Row>
          <Row>
            <Col>
              {" "}
              <i
                class="fas fa-envelope"
                style={{
                  margin: "10px 10px 20px 0px",
                  fontSize: "1.2rem",
                  color: "rgb(7, 107, 146)"
                }}
              ></i>
              <b>Email</b> {this.state.email}
            </Col>
            <Col>
              {" "}
              <i
                class="fas fa-mobile"
                style={{
                  margin: "10px 10px 20px 0px",
                  fontSize: "1.2rem",
                  color: "rgb(7, 107, 146)"
                }}
              ></i>
              <b>Mobile</b> {this.state.phoneNumber}
            </Col>
          </Row>
          <Row>
            <Col>
              {" "}
              <i
                class="fas fa-address-card"
                style={{
                  margin: "10px 10px 20px 0px",
                  fontSize: "1.2rem",
                  color: "rgb(7, 107, 146)"
                }}
              ></i>
              <b>Street </b> {this.state.street}
            </Col>
            <Col>
              {" "}
              <i
                class="fas fa-city"
                style={{
                  margin: "10px 10px 20px 0px",
                  fontSize: "1.2rem",
                  color: "rgb(7, 107, 146)"
                }}
              ></i>
              <b>City</b> {this.state.city}
            </Col>
          </Row>
          <Row>
            <Col>
              {" "}
              <i
                class="fas fa-flag-usa"
                style={{
                  margin: "10px 10px 20px 0px",
                  fontSize: "1.2rem",
                  color: "rgb(7, 107, 146)"
                }}
              ></i>
              <b>State</b> {this.state.state}
            </Col>
            <Col>
              {" "}
              <i
                class="fas fa-hashtag"
                style={{
                  margin: "10px 10px 20px 0px",
                  fontSize: "1.2rem",
                  color: "rgb(7, 107, 146)"
                }}
              ></i>
              <b>Zipcode</b> {this.state.zipcode}
            </Col>
          </Row>

          <br></br>
          <Button className="buttonButton" onClick={this.updatePage}>
            {" "}
            Update
          </Button>
        </div>
      );
    } else {
      personalProfileDetails = (
        <div>
          <br></br>
          <Row>
            <Col>
              <i
                class="fas fa-user"
                style={{
                  margin: "10px 10px 20px 0px",
                  fontSize: "1.2rem",
                  color: "rgb(7, 107, 146)"
                }}
              ></i>
              <b>Screen Name</b> {this.state.screenName}
            </Col>
            <Col>
              <i
                class="fas fa-key"
                style={{
                  margin: "10px 10px 20px 0px",
                  fontSize: "1.2rem",
                  color: "rgb(7, 107, 146)"
                }}
              ></i>
              <b>Nickname</b>{" "}
              <input
                type="text"
                onChange={this.inputChangeHandler}
                name="nickName"
                id="nickName"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              {" "}
              <i
                class="fas fa-envelope"
                style={{
                  margin: "10px 10px 20px 0px",
                  fontSize: "1.2rem",
                  color: "rgb(7, 107, 146)"
                }}
              ></i>
              <b>Email</b> {this.state.email}
            </Col>
            <Col>
              {" "}
              <i
                class="fas fa-mobile"
                style={{
                  margin: "10px 10px 20px 0px",
                  fontSize: "1.2rem",
                  color: "rgb(7, 107, 146)"
                }}
              ></i>
              <b>Mobile</b>{" "}
              <input
                type="number"
                value={this.state.mobile}
                onChange={this.inputChangeHandler}
                name="phoneNumber"
                id="phoneNumber"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              {" "}
              <i
                class="fas fa-address-card"
                style={{
                  margin: "10px 10px 20px 0px",
                  fontSize: "1.2rem",
                  color: "rgb(7, 107, 146)"
                }}
              ></i>
              <b>Street </b>{" "}
              <input
                type="text"
                value={this.state.street}
                onChange={this.inputChangeHandler}
                name="street"
                id="street"
              />
            </Col>
            <Col>
              {" "}
              <i
                class="fas fa-city"
                style={{
                  margin: "10px 10px 20px 0px",
                  fontSize: "1.2rem",
                  color: "rgb(7, 107, 146)"
                }}
              ></i>
              <b>City</b>{" "}
              <input
                type="text"
                value={this.state.city}
                onChange={this.inputChangeHandler}
                name="city"
                id="city"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              {" "}
              <i
                class="fas fa-flag-usa"
                style={{
                  margin: "10px 10px 20px 0px",
                  fontSize: "1.2rem",
                  color: "rgb(7, 107, 146)"
                }}
              ></i>
              <b>State</b>{" "}
              <input
                type="text"
                value={this.state.state}
                onChange={this.inputChangeHandler}
                name="state"
                id="state"
              />
            </Col>
            <Col>
              {" "}
              <i
                class="fas fa-hashtag"
                style={{
                  margin: "10px 10px 20px 0px",
                  fontSize: "1.2rem",
                  color: "rgb(7, 107, 146)"
                }}
              ></i>
              <b>Zipcode</b>{" "}
              <input
                type="number"
                value={this.state.zipcode}
                onChange={this.inputChangeHandler}
                name="zipcode"
                id="zipcode"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              {" "}
              <i
                class="fas fa-key"
                style={{
                  margin: "10px 10px 20px 0px",
                  fontSize: "1.2rem",
                  color: "rgb(7, 107, 146)"
                }}
              ></i>
              <b>Password</b>{" "}
              <input
                type="password"
                onChange={this.inputChangeHandler}
                name="password"
                id="password"
              />
            </Col>
          </Row>
          <br></br>
          <Button className="buttonButton" onClick={this.saveForm}>
            {" "}
            Save
          </Button>
        </div>
      );
    }
    let navbarType = null;
    if (localStorage.getItem("role") == "Admin") {
      navbarType = <HoriNavbar />;
    } else if (localStorage.getItem("role") == "Pooler") {
      navbarType = <Navbar />;
    }

    return (
      <div className="mainDiv">
        {redirectVar}
        {navbarType}
        <div className="homeDiv23">
          <Container>
            <h3>Personal Details</h3>
            {personalProfileDetails}

            <br></br>

            <p></p>
          </Container>
        </div>
      </div>
    );
  }
}
export default Profile;
