import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Jumbotron from "react-bootstrap/Jumbotron";
import "./BrowsePools.css";
import { serverIp, serverPort } from "../config";
const hostAddress= "" + serverIp + ":" + serverPort + "";

class BrowsePools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: "",
      result: [],
      details: 0,
      status: "",
      poolName: "",
      reference: "",
      msg: ""
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleJoinPool = this.handleJoinPool.bind(this);
  }
  handleSearch = e => {
    //prevent page from refresh
    e.preventDefault();
    let keywords = this.state.keywords;
    axios
      .post(hostAddress + "/browsePool", { data: keywords })
      .then(response => {
        if (response.data.length == 0) {
          this.setState({
            details: 2
          });
        } else {
          this.setState({
            result: this.state.result.concat(response.data),
            details: 1
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  handleJoinPool = e => {
    console.log(e.target.id);
    this.setState({
      poolName: e.target.id
    });
    axios
      .post(hostAddress + "/userStatus", {
        email: localStorage.getItem("email")
      })
      .then(response => {
        if (response.data == "cannot join") {
          this.setState({
            status: "Already member of a Pool!"
          });
        } else if (response.data == "can join") {
          axios
            .post(hostAddress + "/joinPool", {
              email: localStorage.getItem("email"),
              poolName: this.state.poolName,
              referenceName: this.state.reference
            })
            .then(response => {
              this.setState({
                msg: response.data
              });
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  componentDidMount() {
    this.setState({
      result: [],
      details: 0,
      msg: "",
      status: ""
    });
    //localStorage.setItem("email", "kaniks.k247@gmail.com");
  }

  render() {
    let details_result;
    if (this.state.details == 2) {
      details_result = (
        <div
          style={{
            marginLeft: "40rem",
            fontSize: "1.5rem"
          }}
        >
          No results found!!
        </div>
      );
    } else if (this.state.details == 1) {
      details_result = this.state.result.map(result => {
        return (
          <div>
            <Card style={{ width: "70rem", marginLeft: "8rem" }}>
              <br />
              <Card.Title
                style={{
                  marginLeft: "1rem",
                  fontSize: "1.5rem"
                }}
              >
                <Form>
                  <Form.Group controlId="reference">
                    <Row>
                      <Col>{result.name}</Col>
                      <Col>
                        <Form.Control
                          style={{ width: "40rem" }}
                          type="text"
                          placeholder="Enter reference's ScreenName. Can also be the Pool Leader. "
                          name="reference"
                          //value={this.state.reference}
                          onChange={this.handleChange}
                          required
                        />
                      </Col>
                      <Col>
                        <Button
                          className="buttonButton"
                          id={result.name}
                          onClick={this.handleJoinPool}
                        >
                          Join Pool
                        </Button>
                      </Col>
                    </Row>
                  </Form.Group>
                </Form>
              </Card.Title>
              <Card.Subtitle
                className="mb-2 text-muted"
                style={{
                  marginLeft: "1rem",
                  fontSize: "1rem"
                }}
              >
                <Row>
                  <Col>
                    {result.address.street +
                      " " +
                      result.address.city +
                      " " +
                      result.address.state +
                      " " +
                      result.address.zip}
                  </Col>
                </Row>
              </Card.Subtitle>
            </Card>
            <br />
            <br />
          </div>
        );
      });
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
      <div>
        {redirectVar}
        <Navbar />

        <div className="leftalign">
          <Jumbotron>
            <h1>Browse Pools Here</h1>
          </Jumbotron>
          <center>
            <Card style={{ width: "70rem" }}>
              <br></br>
              <span
                className="fas fa-search"
                style={{
                  marginRight: "10px",
                  fontSize: "1.5rem",
                  color: "rgb(7, 107, 146)"
                }}
              ></span>
              <br></br>

              <br></br>
              <center>
                <div>
                  <Form style={{ width: "50rem" }}>
                    <Form.Group controlId="keywords">
                      <Row>
                        <Col>
                          <Form.Control
                            style={{ width: "40rem" }}
                            type="text"
                            placeholder="Enter keywords to search for a pool "
                            name="keywords"
                            value={this.state.searchitem}
                            onChange={this.handleChange}
                            required
                          />
                        </Col>
                        <Col>
                          <Button
                            className="buttonButton"
                            onClick={this.handleSearch}
                          >
                            Search
                          </Button>
                        </Col>
                      </Row>
                    </Form.Group>
                    <br />
                  </Form>
                </div>
                <br></br>
                <span style={{ color: "rgb(255, 0, 0)" }}>
                  {this.state.status}
                </span>
                <br />
                <span style={{ color: "rgb(255, 0, 0)" }}>
                  {this.state.msg}
                </span>
                <br></br>
                <br></br>
              </center>
            </Card>
            <br></br>
            <br></br>
          </center>
          {details_result}
        </div>
      </div>
    );
  }
}

export default BrowsePools;
