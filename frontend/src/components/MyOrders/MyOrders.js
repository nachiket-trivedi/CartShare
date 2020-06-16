import React, { Component } from "react";
import { Col, Row, Container, ListGroup } from "react-bootstrap";
import "./MyOrders.css";
import axios from "axios";
import { Redirect } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Navbar from "../Navbar/Navbar";
// import "react-dropdown/style.css";
import Jumbotron from "react-bootstrap/Jumbotron";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import { serverIp, serverPort } from "../config";
let newArr = [];
const hostAddress= "" + serverIp + ":" + serverPort + "";
let response = [],
  quantityMap = {},
  store,
  jtron,
  cart,
  cartArr,
  redirectToOrders = null,
  table,
  cards = null;
class MyOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCards: null,
      response: {},
      redirectToStore: null,
      jtron: null,
      cards: null,
      cart: {},
      dataReceived: false,
      noOrders:false,
      notAPoolMember:false
    };
  }

  componentDidMount = () => {

    axios.post(hostAddress+"/checkUserPool",{email:localStorage.getItem("email")})
    .then(response=>{

      console.log("Pool Id from Backend:"+response.data)
      if(response.data == "notset"){
        this.setState({
          notAPoolMember:true
        })
      }
      else{
        localStorage.setItem("pool",response.data)
        let data = {
          poolId: localStorage.getItem("pool"),
          email: localStorage.getItem("email")
        };
        axios.post(hostAddress+"/fetchMyOrders", data).then(response => {
          console.log("fetched orders", response.data);
          if(Object.keys(response.data).length == 0){
            this.setState({noOrders:true})
          }
          cards = response.data.map(item => {
            let i = 1;
            let OrderItemText = item["orderItems"].map(ele => {
              return (
                <Card.Text>
                  {i++}) Name: {ele["productName"]}, Unit: {ele["unit"]}, Quantity:{" "}
                  {ele["itemQuantity"]}, Price Incurred: {ele["totalPrice"]}
                </Card.Text>
              );
            });
            let disableval = item["orderStatus"] == "Delivered" ? false : true;
            // let colVal=item['orderStatus']=='Pladced'?  'primary': 'secondary'
            return (
              <Card className="indiCards2" style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>Store: {item["storeName"]}</Card.Title>
                  <Card.Text>Pool: {item["pool"]["name"]}</Card.Text>
                  <Card.Text>Pool Leader: {item["pool"]["poolLeader"]}</Card.Text>
                  <Card.Text>Order Status: {item["orderStatus"]}</Card.Text>
                  <Card.Text>Order Total: {item["orderTotal"]}</Card.Text>
                  <Card.Text>Delivery Pooler: {item["deliveryPooler"]}</Card.Text>
                  <Card.Text>Created At: {item["createdAt"]}</Card.Text>
                  <hr />
                  {OrderItemText}
                  <hr />
                  <Button
                    onClick={this.mailPooler.bind(this, item)}
                    disabled={disableval}
                  >
                    Report
                  </Button>{" "}
                  (If undelivered)
                </Card.Body>
              </Card>
            );
          });
          this.setState({});
        });

      }

    })
    
  };
  mailPooler = item => {
    //console.log("inside mail pooler. item is " + JSON.stringify(item));
    //console.log("newArr is", newArr);
    newArr = item["orderItems"].slice(0);
    // console.log("newArr is", newArr);

    newArr.push({ orderTotal: item["orderTotal"] });
    newArr.push({ poolId: item["pool"]["poolId"] });
    newArr.push({ email: item["email"] });
    newArr.push({ deliveryPooler: item["deliveryPooler"] });
    newArr.push({ storeName: item["storeName"] });
    console.log("newArr is", newArr);
    //console.log("item", item);
    axios.post(hostAddress + "/mailIfUndelivered", newArr).then(response => {
      alert("Succesfully notified via e-mail!");
    });
  };
  render() {
    if (!localStorage.getItem("email")) {
      redirectToOrders = <Redirect to="/login" />;
    }
    if(this.state.noOrders){
      var NoOrderMessage ="  Sorry there are no orders to show!"
    }
    if(this.state.notAPoolMember){
      var notAPoolMemberMessage ="  You are not a member of any Pool!"
    }
    return (
      <div className="mainDiv">
        {redirectToOrders}
        <Navbar />
        <div className="leftalign">
          <Jumbotron>
            <h1>My orders</h1>
          </Jumbotron>
          {cards}
          <h4>{NoOrderMessage}</h4>
          <h4>{notAPoolMemberMessage}</h4>
        </div>
      </div>
    );
  }
}

export default MyOrders;
