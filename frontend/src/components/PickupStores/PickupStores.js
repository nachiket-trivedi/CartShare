import React, { Component } from "react";
import { Col, Row, Container, Table, CardColumns, Card } from "react-bootstrap";
import "./PickupStores.css";
import axios from "axios";
import { Redirect } from "react-router";
import Button from "react-bootstrap/Button";
import "react-dropdown/style.css";
import "react-dropdown/style.css";
import Dropdown from "react-dropdown";
import Modal from "react-bootstrap/Modal";
import Jumbotron from "react-bootstrap/Jumbotron";
import QRCode from "qrcode";
import Navbar from "../Navbar/Navbar";

import { serverIp, serverPort } from "../config";
const hostAddress= "" + serverIp + ":" + serverPort + "";
let orderString = "";
let redirectVar = null;
class PickupStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderList: [],
      checkoutStatus: "",
      nothingPresent: "",
      displayStoreOrders: [],
      storeList: [],
      store: ""
    };

    this.searchStore = this.searchStore.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.checkOutOrder = this.checkOutOrder.bind(this);
    this.generateQR = this.generateQR.bind(this);
    this.storeChangeHandler = this.storeChangeHandler.bind(this);
  }

  componentDidMount = () => {
    //Add Axios Code to Get orders List
    console.log("inside component did mount");
    let temp = [];
    axios.defaults.withCredentials = false;
    axios
      .post(hostAddress + "/getPlacedOrders", {
        email: localStorage.getItem("email")
      })
      .then(response => {
        if (response.data == "no orders found") {
          this.setState({
            nothingPresent: "Nothing to show here!!"
          });
        } else {
          response.data.map(item => {
            if (item.storeName != null) {
              temp.push(item.storeName);
            }
          });

          // alert(temp);

          temp = temp.filter(function(item, pos) {
            return temp.indexOf(item) == pos;
          });

          this.setState({
            storeList: temp,
            displayStoreOrders: [],
            orderList: response.data
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
  generateQR = e => {
    let st = orderString;

    let l = st.length / 2;
    let str = st.slice(0, l);

    QRCode.toCanvas(document.getElementById("canvas"), str, function(error) {
      if (error) console.error(error);
    });
  };
  checkOutOrder = e => {
    console.log("inside checkout order: ");
    console.log("details are :" + this.state.store);
    let data = {
      email: localStorage.getItem("email"),
      storeName: this.state.store
    };

    axios
      .post(hostAddress + "/checkoutOrders", data)
      .then(response => {
        if (response.data == "Orders have been picked") {
          this.setState({
            checkoutStatus: "Orders have been picked"
          });
        }
      })
      .catch(function(error) {
        console.log(error);
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
    let storeDetails = null;

    let body1 = null;
    let detail = [];
    let innerDetails = [];
    let body2 = null;
    //Add iterator to display all
    body1 = this.state.displayStoreOrders.map(order => {
      // console.log("order details :" + JSON.stringify(order));

      orderString = orderString + "orderId" + order.orderId;

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
              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
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
            <Card.Text>Total: {order.orderTotal}</Card.Text>
            <Card.Text>(including Taxes)</Card.Text>
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
        <div>
          <CardColumns>
            {body1}
            {detail}
          </CardColumns>

          <div>
            <Button
              className="buttonButton right"
              onClick={this.generateQR.bind(this)}
            >
              Generate QR Code
            </Button>
            {"         "}
            <Button
              className="buttonButton right"
              onClick={this.checkOutOrder.bind(this)}
            >
              Checkout
            </Button>
            <br />
            <br />
            <div>
              <canvas id="canvas" align="center" />
            </div>
            {this.state.checkoutStatus}
          </div>
        </div>
      );
    }

    return (
      <div className="mainDivFull">
        <Navbar />
        {redirectVar}
        <div className="leftalign">
          <Jumbotron>
            <h1>Orders List</h1>
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
            <h5>{this.state.nothingPresent}</h5>
            {storeDetails}
          </Container>
        </div>
      </div>
    );
  }
}

export default PickupStores;
