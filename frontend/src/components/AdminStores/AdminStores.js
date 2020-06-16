import React, { Component } from "react";
import { Col, Row, Container, ListGroup } from "react-bootstrap";
import "./AdminStores.css";
import axios from "axios";
import { Redirect } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Navbar from '../Navbar/HorizontalNav';
import "react-dropdown/style.css";
import AddStore from './AddStore';
import ViewStores from './ViewStores'

class AdminProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
   
  }
  componentDidMount = () => {};

  render() {
    let redirectVar=null;
    if (localStorage.getItem("role") == "Admin") {
      if (localStorage.getItem("verified") != "true") {
        redirectVar = <Redirect to="/notVerified" />;
      } 
    } else if (localStorage.getItem("role") == "Pooler") {
     
        redirectVar = <Redirect to="/home" />;
    }else{
      redirectVar = <Redirect to="/login" />;
    }
    return (
    <div className="mainDiv">
      {redirectVar}
      <Navbar />
      <AddStore/>
      <hr></hr>
      <ViewStores/>
    </div>
  );
}
}

export default AdminProducts;