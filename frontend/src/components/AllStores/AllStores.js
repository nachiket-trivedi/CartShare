import React, { Component } from "react";
import { Col, Row, Container, ListGroup } from "react-bootstrap";
import "./AllStores.css";
import axios from "axios";
import { Redirect } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Navbar from "../Navbar/Navbar";
// import "react-dropdown/style.css";
import Card from "react-bootstrap/Card";
import Jumbotron from "react-bootstrap/Jumbotron";
import { serverIp, serverPort } from "../config";
const hostAddress= "" + serverIp + ":" + serverPort + "";

let redirectToLogin = null;
class AllStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCards: null,
      redirectToStore: null
    };
  }
  visitStore = (id, name) => {
    localStorage.setItem("storeId", id);
    this.setState({
      redirectToStore: (
        <Redirect
          to={{
            pathname: "/storePage",
            state: { storeId: id, storeName: name }
          }}
        />
      )
    });
  };
  componentDidMount = () => {
    //   axios.setCredentials=true
    axios.get(hostAddress +"/browseStores").then(response => {
      console.log(response.data);
      let storeArr = response.data;
      this.setState({
        allCards: storeArr.map(item => {
          return (
            <Card className="indiCards1" style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>{item["name"]}</Card.Title>
                <Card.Text>Description: {item["description"]}</Card.Text>
                <Card.Text>
                  Address: {item["address"]["street"]},{" "}
                  {item["address"]["city"]}, {item["address"]["zip"]}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={this.visitStore.bind(
                    this,
                    item["storeId"],
                    item["name"]
                  )}
                >
                  Visit
                </Button>
              </Card.Body>
            </Card>
          );
        })
      });
    });
  };

  render() {
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
        {this.state.redirectToStore}
        <Navbar />

        <div className="leftalign">
          <Jumbotron>
            <h1>Available Stores</h1>
          </Jumbotron>
          {this.state.allCards}
        </div>
      </div>
    );
  }
}

export default AllStores;
