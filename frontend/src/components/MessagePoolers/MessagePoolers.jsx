import React, { Component } from "react";
import { Col, Row, Container } from "react-bootstrap";
import "./MessagePoolers.css";
import axios from "axios";
import { Redirect } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "react-dropdown/style.css";
import { TabProvider, Tab, Tabs, TabPanel, TabList } from "react-web-tabs";
import "react-dropdown/style.css";
import Dropdown from "react-dropdown";
import Jumbotron from "react-bootstrap/Jumbotron";
import Navbar from "../Navbar/Navbar";
import { serverIp, serverPort } from "../config";
let PoolDetails;
let NoMembers;
let AllMembers;
let MessageBox;
const hostAddress= "" + serverIp + ":" + serverPort + "";
class MessagePoolers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      poolMembers: [],
      MemberList: [],
      member: "",
      memberPresent: "",
      displayStoreOrders: [],
      storeList: [],
      store: "",
      message: "",
      messageStatus: ""
    };

    this.selectMember = this.selectMember.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.memberChangeHandler = this.memberChangeHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  sendMessage(e) {
    console.log("selected member is " + this.state.member);
    console.log("message is " + this.state.message);
    let data = {
      senderEmail: localStorage.getItem("email"),
      receiverNickname: this.state.member,
      message: this.state.message
    };
    axios
      .post(hostAddress + "/sendMessage", data)
      .then(response => {
        console.log("response in send msg is " + response.data);
        if (response.data == "No message provided") {
          this.setState({
            messageStatus: "No message provided"
          });
        } else if (response.data == "Message has been sent") {
          this.setState({
            messageStatus: "Message has been sent"
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  componentDidMount = () => {
    //Add Axios Code to Get orders List

    console.log("inside component did mount");
    let temp = [];
    axios
      .post(hostAddress + "/getPool", {
        email: localStorage.getItem("email")
      })
      .then(response => {
        console.log("inside response");
        if (response.data == "create") {
          this.setState({
            status: "create"
          });
        } else {
          console.log(
            "response in msg pooler is " + JSON.stringify(response.data)
          );
          localStorage.setItem("pool", response.data.poolId);
          this.setState({
            poolMembers: response.data.members
          });
          console.log("members are " + this.state.poolMembers);
        }
        if (this.state.poolMembers.length > 1) {
          this.state.poolMembers.map(result => {
            if (result.email != localStorage.getItem("email")) {
              temp.push(result.screenName);
            }
          });
          this.setState({
            MemberList: temp
          });
          console.log("member list is ", this.state.MemberList);
        } else {
          this.setState({
            memberPresent: "No"
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  clearForm = () => {
    window.location.reload();
  };

  memberChangeHandler = value => {
    this.setState({
      member: value.value
    });
    this.member.value = { value };
  };

  selectMember = e => {
    if (this.state.member) {
      console.log("the member you selected is " + this.state.member);
    }
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

    if (this.state.status == "create") {
      AllMembers = (
        <div>
          <center>
            <h4>You are not associated to any pool!</h4>
          </center>
        </div>
      );
    } else if (this.state.memberPresent == "No") {
      {
        /* NoMembers = (
        <div>
          <center>
            <h4>No other members are associated to this pool yet!</h4>
          </center>
        </div>
     );*/
      }
      AllMembers = (
        <div>
          <center>
            <h4>No other members are associated to this pool yet!</h4>
          </center>
        </div>
      );
    } else {
      AllMembers = (
        <div>
          <Row>
            <Col>
              <Dropdown
                options={this.state.MemberList}
                name="members"
                placeholder="Select Member to message"
                ref={ref => (this.member = ref)}
                onChange={this.memberChangeHandler}
                value={this.state.member}
              />
            </Col>
            <Col>
              <span>
                <Button className="buttonButton" onClick={this.selectMember}>
                  Filter
                </Button>
              </span>
              <span>
                <Button className="cancelButton" onClick={this.clearForm}>
                  Clear
                </Button>
              </span>
              <br />
              <br />
            </Col>
          </Row>
          <br />
          <br />
          <Form>
            <Form.Group controlId="message" style={{ width: "45rem" }}>
              <Form.Label>Your Message:</Form.Label>
              <Form.Control
                required
                placeholder="Type your message here"
                name="message"
                as="textarea"
                rows="6"
                onChange={this.handleChange}
                defaultValue={this.state.message}
              />
            </Form.Group>
            <br />
            <Button className="buttonButton" onClick={this.sendMessage}>
              Send Message
            </Button>
            <br />
            <br />
            {this.state.messageStatus}
          </Form>
        </div>
      );
      /* MessageBox = (
        <Form>
          <Form.Group controlId="message" style={{ width: "45rem" }}>
            <Form.Label>Your Message:</Form.Label>
            <Form.Control
              required
              placeholder="Type your message here"
              name="message"
              as="textarea"
              rows="6"
              onChange={this.handleChange}
              defaultValue={this.state.message}
            />
          </Form.Group>
          <br />
          <Button className="buttonButton" onClick={this.sendMessage}>
            Send Message
          </Button>
          <br />
          <br />
          {this.state.messageStatus}
        </Form>
      );*/
    }
    return (
      <div className="mainDivFull">
        {redirectVar}
        <Navbar />

        <div className="leftalign">
          <Jumbotron>
            <h1>Message Poolers</h1>
          </Jumbotron>
          <br></br>
          {/*{PoolDetails}
          {NoMembers}*/}
          <Container>{AllMembers}</Container>
          <br />
          <br />
          {/*MessageBox*/}
        </div>
      </div>
    );
  }
}

export default MessagePoolers;
