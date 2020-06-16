import React, { Component } from "react";
import { Container, Button } from "react-bootstrap";

import { Redirect } from "react-router";

import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

require("@firebase/auth");
require("@firebase/firestore");

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {
    firebase.default.auth().signOut();
    localStorage.clear();
  };

  render() {
    let redirectVar = null;

    return (
      <div className="mainDiv">
        <div className="coverImage"></div>
        <hr></hr>
        <Container>
          <h3>
            <b>Email is not Verified!</b>
          </h3>
          <div>
            <a href="/login">
            <Button className="buttonButton">
Go Back
            </Button>
            </a>
          </div>

        </Container>
      </div>
    );
  }
}

export default Home;
