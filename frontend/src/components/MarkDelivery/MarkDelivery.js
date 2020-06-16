import React, { Component } from "react";
import {
  Col,
  Row,
  Container,
  ListGroup,
  Table,
  CardColumns,
  Card
} from "react-bootstrap";
import "./MarkDelivery.css";
import axios from "axios";
import { Redirect } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "react-dropdown/style.css";
import "react-dropdown/style.css";
import Jumbotron from "react-bootstrap/Jumbotron";
import Dropdown from "react-dropdown";
import Navbar from "../Navbar/Navbar";

import { serverIp, serverPort } from "../config";
const hostAddress= "" + serverIp + ":" + serverPort + "";
let redirectVar = null;
class MarkDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderList: [],
      nothingPresent: "",
      displayStoreOrders: [],
      storeList: [],
      store: ""
    };

    this.markDelivered = this.markDelivered.bind(this);
    this.searchStore = this.searchStore.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.storeChangeHandler = this.storeChangeHandler.bind(this);
  }

  componentDidMount = () => {
    //Add Axios Code to Get orders List

    console.log("inside component did mount");
    let temp = [];
    axios.defaults.withCredentials = false;
    axios
      .post(hostAddress + "/getPickedOrders", {
        email: localStorage.getItem("email")
      })
      .then(response => {
        // alert("inside response");
        console.log();
        response.data.map(item => {
          if (item.storeName != null) {
            temp.push(item.storeName);
          }
        });

        temp = temp.filter(function(item, pos) {
          return temp.indexOf(item) == pos;
        });

        this.setState({
          storeList: temp,
          displayStoreOrders: response.data,
          orderList: response.data
        });
        /* this.state.orderList.map(item => {
          temp.push(item.storeName);
        });
         this.setState({
          storeList: temp,
          displayStoreOrders: this.state.orderList
        });*/
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  markDelivered = order => {
    //Axios call to check out. Access the orderId by e.value.id
    console.log("inside markdelivered");
    console.log("email is " + order.email);
    console.log("order is " + order.orderId);
    let data = {
      email: order.email,
      orderId: order.orderId
    };
    axios
      .post(hostAddress + "/deliverOrders", data)
      .then(response => {
        console.log("response of marked delivered ");
        console.log("response is " + response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  clearForm = () => {
    window.location.reload();
  };

  storeChangeHandler = value => {
    this.setState({
      store: value.value
    });
    this.store.value = { value };
  };

  searchStore = e => {
    if (this.state.store) {
      let temp = [];
      this.state.orderList.map(item => {
        if (item.storeName == this.state.store) {
          temp.push(item);
        }
      });

      this.setState({
        displayStoreOrders: temp
      });
    } else {
      this.setState({
        displayStoreOrders: this.state.orderList
      });
    }
  };

  render() {
    let redirectVar = null;
    let email = localStorage.getItem("email");

    if (
      localStorage.getItem("email") == null ||
      localStorage.getItem("role") == "Admin"
    ) {
      redirectVar = <Redirect to="/login" />;
    }
    let storeDetails = null;

    let body1 = null;
    let detail = [];
    let innerDetails = [];
    let body2 = null;
    //Add iterator to display all
    body1 = this.state.displayStoreOrders.map(order => {
      body2 = order.orderItems.map(item => {
        innerDetails.push(
          <tr>
            <td>{item.productName}</td>
            <td>{item.itemQuantity}</td>
            <td>{item.unit}</td>
            <td>${item.totalPrice}</td>
          </tr>
        );
      });

      detail.push(
        <Card className="text-center fullcard">
          <Card.Body>
            <Card.Title>
              <span>{order.storeName}</span>
            </Card.Title>
            <Card.Text>
              <Row>
                <Col>
                  <b>Deliver To: {order.user.nickname} </b>
                </Col>
              </Row>
              <Row>
                <Col>{order.user.address.street}</Col>
              </Row>
              <Row>
                <Col>{order.user.address.city}</Col>
              </Row>
              <Row>
                <Col>
                  <span>{order.user.address.state}</span>
                  <span> {order.user.address.zip}</span>
                </Col>
              </Row>
            </Card.Text>
            <Card.Text>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {" "}
                  {body2}
                  {innerDetails}
                </tbody>
              </Table>{" "}
            </Card.Text>
            <Card.Text>Total: ${order.orderTotal}</Card.Text>
            <Card.Text>(Including Taxes and convenience fee)</Card.Text>
            <Card.Text>
              <Button
                className="buttonButton"
                onClick={this.markDelivered.bind(this, order)}
              >
                Mark Delivered
              </Button>
            </Card.Text>
          </Card.Body>
        </Card>
      );
      body2 = null;
      innerDetails = [];
    });

    if (this.state.displayStoreOrders.length == 0) {
      {
        /* storeDetails = (
        <div>
          <center>
            <h4>Nothing to show here!:(</h4>
          </center>
        </div>
            );*/
      }
    } else {
      storeDetails = (
        <CardColumns>
          {body1}
          {detail}
        </CardColumns>
      );
    }

    return (
      <div className="mainDivFull">
        {redirectVar}
        <Navbar />
        <div className="leftalign">
          <Jumbotron>
            <h1>Picked Up Orders</h1>
          </Jumbotron>
          <br></br>
          <Container>
            <br></br>
            <Row>
              <Col>
                <Dropdown
                  options={this.state.storeList}
                  name="store"
                  placeholder="Select Store"
                  ref={ref => (this.store = ref)}
                  onChange={this.storeChangeHandler}
                  value={this.state.store}
                />
              </Col>
              <Col>
                <span>
                  <Button className="buttonButton" onClick={this.searchStore}>
                    Filter
                  </Button>
                </span>
                <span>
                  <Button className="cancelButton" onClick={this.clearForm}>
                    Clear
                  </Button>
                </span>
              </Col>
            </Row>
            <br></br>
            {storeDetails}
          </Container>
        </div>
      </div>
    );
  }
}

export default MarkDelivery;
