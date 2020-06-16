import React, { Component } from "react";
import { Col, Card } from "react-bootstrap";
import "./Login.css";
import { Redirect } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "react-dropdown/style.css";
import firebase from "firebase";
import * as firebaseui from "firebaseui";

import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import axios from "axios";
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

let uiConfig = {
  signInFlow: "redirect",
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: { signInSuccess: () => false }
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };

    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }

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
        const data = {
          email: localStorage.getItem("email"),
          password: "",
          gAuth: true
        };

        console.log(data);
        axios.defaults.withCredentials = false;
        axios
          .post(hostAddress + "/login", data)
          .then(response => {
            //  alert(response.status);
            console.log("Response data after login post-->" + response.data);
            localStorage.setItem("email", response.data["email"]);
            localStorage.setItem("screenName", response.data["screenName"]);
            localStorage.setItem("nickname", response.data["nickname"]);
            localStorage.setItem("role", response.data["userType"]);
            localStorage.setItem("verified", response.data["verified"]);
            // this.setState({
            // })

            window.location.reload();
          })
          .catch(err => {
            console.log(err.status);
            alert(err.response.data["error"]);
          });
      }

      //alert(user);
      // console.log("user", user);
      // if (localStorage.getItem("email")) {
      //   console.log(localStorage.getItem("email"));

      // const data = {
      //   email: localStorage.getItem("email"),
      //   password: "",
      //   nickName: s[0],
      //   gAuth: true,
      //   screenName: s[0]
      // };

      // axios.defaults.withCredentials = false;
      // axios
      //   .post(hostAddress + "/signup", data)
      //   .then(response => {
      //     //alert(response.status);
      //     console.log("Response data after login post-->" + response.data);
      //     localStorage.setItem("email", response.data.User["email"]);
      //     localStorage.setItem("screenName", response.data.User["screenName"]);
      //     localStorage.setItem("nickname", response.data.user["nickname"]);
      //     localStorage.setItem("role", response.data.User["userType"]);
      //     localStorage.setItem("isVerified", response.data.User["verified"]);
      //   })
      //   .catch(err => {
      //     // console.log(err.status);
      //     // alert(err.response.data["error"]);
      //   });
      //}
      // this.setState({});
    });
  }

  inputChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  //submit Login handler to send a request to the node backend
  submitLogin = e => {
    //prevent page from refresh
    e.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password,
      gAuth: false
    };
    console.log(data);
    axios.defaults.withCredentials = false;
    axios
      .post(hostAddress + "/login", data)
      .then(response => {
        //  alert(response.status);
        console.log("Response data after login post-->" + response.data);
        localStorage.setItem("email", response.data["email"]);
        localStorage.setItem("screenName", response.data["screenName"]);
        localStorage.setItem("nickname", response.data["nickname"]);
        localStorage.setItem("role", response.data["userType"]);
        localStorage.setItem("verified", response.data["verified"]);
        // this.setState({
        // })

        window.location.reload();
      })
      .catch(err => {
        console.log(err.status);
        alert(err.response.data["error"]);
      });
  };

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

  submitSignup = e => {
    return <Redirect to="/signup" />;
  };

  render() {
    let goog = null;
    //redirect based on successful login
    let redirectVar = null;
    if (localStorage.getItem("role") == "Admin") {
      if (!localStorage.getItem("verified") || localStorage.getItem("verified") == "false") {
        redirectVar = <Redirect to="/notVerified" />;
      } else {
        redirectVar = <Redirect to="/adminHome" />;
      }
    } else if ( localStorage.getItem("role") == "Pooler") {
      if (!localStorage.getItem("verified") || localStorage.getItem("verified") == "false") {
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
            <h4>Let's get Started!</h4>
            <Form className="input">
              <Form.Row>
                <Col>
                  <Form.Control
                    placeholder="Email"
                    type="email"
                    name="email"
                    id="email"
                    onChange={this.inputChangeHandler.bind(this)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    placeholder="Password"
                    type="password"
                    name="password"
                    id="password"
                    onChange={this.inputChangeHandler.bind(this)}
                  />
                </Col>
              </Form.Row>
              <br></br>

              <Form.Row>
                <Col>
                  <center>
                    <Button
                      className="buttonButton"
                      onClick={this.submitLogin.bind(this)}
                    >
                      Login
                    </Button>
                  </center>
                </Col>
              </Form.Row>
              <br></br>
              <a className="linkColor" href="/signup">
                {" "}
                Register Today
              </a>
            </Form>
            {goog} 
          </Card>
        </center>
      </div>
    );
  }
}

export default Login;
