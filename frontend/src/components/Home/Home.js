import React, { Component } from "react";
import { Container } from "react-bootstrap";
import "./Home.css";
import Navbar from "../Navbar/Navbar";
import { Redirect } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {};

  render() {
    let redirectVar = null;
    if (
      localStorage.getItem("verified") != "true" ||
      localStorage.getItem("email") == null ||
      localStorage.getItem("role") == "Admin"
    ) {
      redirectVar = <Redirect to="/login" />;
    }

    return (
      <div className="mainDiv">
        {redirectVar}
        <Navbar />
        <div className="coverImage"></div>
        <hr></hr>

        <Container>
          <h3>
            <b>This is my Home!</b>
          </h3>
        </Container>
      </div>
    );
  }
}

export default Home;
