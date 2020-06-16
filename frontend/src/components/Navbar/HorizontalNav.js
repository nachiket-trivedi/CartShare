import Navbar from "react-bootstrap/Navbar";
import React from "react";
import { Redirect } from "react-router";
import "./Navbar.css";
import { NavDropdown, Nav, Form, FormControl, Button } from "react-bootstrap";

import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

require('@firebase/auth');
require('@firebase/firestore');

class HorizontalNav extends React.Component {

  constructor(props){
    super(props);
    this.state={
      signedOut:false
    }
  }
  handleLogout = () => {
    firebase.default.auth().signOut()
    localStorage.clear();
    this.setState({
      signedOut:true
    })
  }

  render() {
    let redirectNav=null;
    if(this.state.signedOut){
      redirectNav=<Redirect to="/login"/>
    }
    return (
      <Navbar variant="dark" style={{ backgroundColor: " rgb(7, 107, 146)",color:"white"}}>
         {redirectNav}
        <Navbar.Brand href="/adminHome"  className="fas fa-shopping-cart"
              style={{
                marginRight: "1ch",
                fontSize: "2rem",
                color: "white",
              }}></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          <Nav.Link href="/adminStores">Stores</Nav.Link>
          <Nav.Link href="/adminProducts">Products</Nav.Link>
          </Nav>
          <Nav className="mr-sm-2" >
          <Nav.Link href="/profile" style={{margin:"5px",color:"white"}}>Hello! <b className="nameTag">{localStorage.getItem('screenName')}</b></Nav.Link>
          <Nav.Link onClick={this.handleLogout} className="fas fa-sign-out-alt" style={{
                margin: "2px",
                fontSize: "1.8rem",
                color: "white",
              }}></Nav.Link>
      </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default HorizontalNav;
