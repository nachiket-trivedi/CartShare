import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Signup.css";
import { Redirect } from "react-router";
import firebase from "firebase";
import * as firebaseui from "firebaseui";
import axios from "axios";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import { serverIp, serverPort } from "../config";
const hostAddress= "" + serverIp + ":" + serverPort + "";
require("@firebase/auth");
require("@firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyCJtrgGTwd0ppiaM3YAbDQ4DCyncwwjZNQ",
  authDomain: "cartshare-940e4.firebaseapp.com",
  databaseURL: "https://cartshare-940e4.firebaseio.com",
  projectId: "cartshare-940e4",
  storageBucket: "cartshare-940e4.appspot.com",
  messagingSenderId: "725249718354",
  appId: "1:725249718354:web:5ec4b4590cfceae465878b",
  measurementId: "G-305CNGW2NL"
};

firebase.analytics();

let uiConfig = {
  signInFlow: "redirect",
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: { signInSuccess: () => false }
};

let googleAuth = false;

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      screenName: "",
      nickName: "",
      displayImage: ""
    };
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.submitSignup = this.submitSignup.bind(this);
  }

  responseGoogle = async response => {
    console.log(response);
    const userObject = {
      username: response.w3,
      password: "test"
    };
    if (response.w3) {
      await localStorage.setItem("user", JSON.stringify(userObject));
      await window.location.reload();
    } else {
    }
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (!!user) {
        localStorage.setItem("email", firebase.auth().currentUser.email);
        var s = localStorage.getItem("email").split("@");
        if (s[1] == "sjsu.edu") {
          localStorage.setItem("role", "Admin");
        } else {
          localStorage.setItem("role", "Pooler");
        }
      }

      //alert(user);
      console.log("user", user);
      if (localStorage.getItem("email")) {
        console.log(localStorage.getItem("email"));

        const data = {
          email: localStorage.getItem("email"),
          password: "",
          nickName: s[0],
          gAuth: true,
          screenName: s[0]
        };

        axios.defaults.withCredentials = false;
        axios
          .post(hostAddress + "/signup", data)
          .then(response => {
            //alert(response.status);
            console.log("Response data after login post-->" + response.data);
            localStorage.setItem("email", response.data.User["email"]);
            localStorage.setItem(
              "screenName",
              response.data.User["screenName"]
            );
            localStorage.setItem("nickname", response.data.User["nickname"]);
            localStorage.setItem("role", response.data.User["userType"]);
            localStorage.setItem("verified", response.data.User["verified"]);
          })
          .catch(err => {
            // console.log(err.status);
            // alert(err.response.data["error"]);
          });
      }
      this.setState({});
    });
    // firebase.auth().onAuthStateChanged(user => {

    //   if(!!user){
    //     localStorage.setItem("email", firebase.auth().currentUser.email);
    //     localStorage.setItem("mobile", firebase.auth().currentUser.phoneNumber);
    //     localStorage.setItem("fullname", firebase.default.auth().currentUser.displayName);
    //   }
    //  // alert(user);
    //   console.log("user", user);

    //   var s= firebase.auth().currentUser.email.split("@");
    //   console.log(s);
    //   const data={
    //     email: firebase.auth().currentUser.email,
    //     password: this.state.password,
    //     nickName:s[0],
    //     gAuth:googleAuth,
    //     screenName:s[0],
    //     displayImage:firebase.auth().currentUser.photoURL
    //   };
    // this.setState({ isSignedIn: !!user,
    //   email: firebase.auth().currentUser.email,
    //   nickName: firebase.auth().currentUser.email,
    //   screenName: firebase.auth().currentUser.email,
    //   displayImage:firebase.auth().currentUser.photoURL,
    //   googleAuth:true
    //  });
    //  })
  }

  inputChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  //submit Login handler to send a request to the node backend
  submitSignup = e => {
    //prevent page from refresh

    const data = {
      email: this.state.email,
      password: this.state.password,
      nickName: this.state.nickName,
      gAuth: false,
      screenName: this.state.screenName
    };
    e.preventDefault();
    console.log(data);

    axios.defaults.withCredentials = false;
    axios
      .post(hostAddress + "/signup", data)
      .then(response => {
        //alert(response.status);
        console.log("Response data after login post-->" + response.data.User);
        localStorage.setItem("email", response.data.User["email"]);
        localStorage.setItem("screenName", response.data.User["screenName"]);
        localStorage.setItem("nickname", response.data.User["nickname"]);
        localStorage.setItem("role", response.data.User["userType"]);
        localStorage.setItem("verified", response.data.User["verified"]);
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
        alert(err.response.data["error"]);
      });
  };

  render() {
    let goog = null;
    //redirect based on successful login
    let redirectVar = null;

    if (localStorage.getItem("role") == "Admin") {
      if (!localStorage.getItem("verified") || localStorage.getItem("verified")=="false") {
        redirectVar = <Redirect to="/notVerified" />;
      } else {
        redirectVar = <Redirect to="/adminHome" />;
      }
    } else if (localStorage.getItem("role") == "Pooler") {
      if (!localStorage.getItem("verified") ||localStorage.getItem("verified")=="false") {
        redirectVar = <Redirect to="/notVerified" />;
      } else {
        redirectVar = <Redirect to="/home" />;
      }
    } 

    if (localStorage.getItem("email") == null) {
      goog = ( // <div>Not Signed In!</div>
        <StyledFirebaseAuth
          style={{ float: "left", marginRight: "100%" }}
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      );
    }
    return (
      <div className="bg">
        {redirectVar}
        <br></br>
        <center>
          <Card style={{ width: "24rem" }}>
            <br></br>
            <span
              className="fas fa-shopping-cart"
              style={{
                marginRight: "10px",
                fontSize: "1.5rem",
                color: "rgb(7, 107, 146)"
              }}
            ></span>
            <br></br>
            <h4>Create your account</h4>
            <br></br>
            <center>
              <div>
                <Form style={{ width: "20rem" }}>
                  <Form.Group controlId="formGridName">
                    <Row>
                      <Col>
                        <Form.Control
                          placeholder="Screen Name"
                          onChange={this.inputChangeHandler.bind(this)}
                          name="screenName"
                          id="screenName"
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          required
                          placeholder="Nick Name"
                          onChange={this.inputChangeHandler.bind(this)}
                          name="nickName"
                          id="nickName"
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group controlId="email">
                    <Form.Control
                      required
                      placeholder="Email"
                      onChange={this.inputChangeHandler.bind(this)}
                      name="email"
                      type="email"
                    />
                  </Form.Group>

                  <Form.Group controlId="password1">
                    <Form.Control
                      type="password"
                      required
                      placeholder="Password"
                      onChange={this.inputChangeHandler.bind(this)}
                      name="password"
                    />
                  </Form.Group>

                  <Button
                    className="buttonButton"
                    type="submit"
                    onClick={this.submitSignup.bind(this)}
                  >
                    Sign Up!
                  </Button>
                </Form>
              </div>
              <br></br>
              <a className="linkColor" href="/login">
                Already Registered?
              </a>
              <br></br>
              <br></br>
              {goog} 
            </center>
          </Card>
        </center>
      </div>
    );
  }
}

export default Signup;
