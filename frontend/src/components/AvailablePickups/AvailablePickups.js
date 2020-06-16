import React, { Component } from "react";
import { Col, Row, Container, ListGroup } from "react-bootstrap";
import "./AvailablePickups.css";
import axios from "axios";
import { Redirect } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Navbar from "../Navbar/Navbar";
// import "react-dropdown/style.css";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Link } from "react-router-dom";
import { serverIp, serverPort } from "../config";
const hostAddress= "" + serverIp + ":" + serverPort + "";

class AvailablePickups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCards: null,
      redirectToStore: null,
      orderNumber: 0,
      redirectToMyOrders:null,
      orders:null,
      orderIds:[],
      noOrders:false
    };
  }
  visitStore = (id, name) => {
    this.setState({
      redirectToStore: (
        <Redirect
          to={{
            pathname: "/storePage",
            state: { storeId: id, storeName: name }
          }}
        />
      )
    });
  };
  onInputChangeHandler = e => {
    this.setState({
      orderNumber: e.target.value
    });
  };

  sendEmail =()=>{

    axios.post(hostAddress +"/sendEmailWhenSkipped",{email:localStorage.getItem("email")})
    .then(response=>{
      console.log("After skipping, the mail was sent to the pooler");
    })
  }
  validate = e => {
    var n = this.state.orderNumber;
    var selectedOrderIds = this.state.orderIds.slice(0,n);
    console.log("selected order ids: "+selectedOrderIds);
    if (n > 10 || n < 0) {
      //Swal.fire('Hello world!')
      Swal.fire({
        icon: "error",
        title: "Please Enter a number from 1 to 10",
        text: "Invalid Order Number"
      });
    } else {
      //axios call to change the order status
      const data ={
        email: localStorage.getItem("email"),
        orderNumber:String(this.state.orderNumber),
        storeid:String(localStorage.getItem("storeId")),
        selectedOrderIds:String(selectedOrderIds)

      }
      axios.post(hostAddress + "/updateDeliveryPooler",data)
      .then(response=>{
        Swal.fire({
          icon: "success",
          title: "Orders are ready to Pickup",
          text:"An Order Confirmation Email is sent the Delivery Pooler"
        }).then(
          ()=>{
            this.setState({redirectToMyOrders:<Redirect to="/myOrders" />})
          }
        )
      })
    }
  };
  componentDidMount = () => {
    //   axios.setCredentials=true
    axios
      .post(hostAddress + "/getFellowOrders", { email: localStorage.getItem("email"),storeid:String(localStorage.getItem("storeId")) })
      .then(response => {
        console.log("ORDERS1:", response.data);
        var orders1 = response.data;
        var orders =[];
        var orderIds=[];
        Object.keys(orders1).forEach(function(key, index){
          orders.push(orders1[key])
          orderIds.push(key)
        })
        if(orders.length==0){
          this.setState({
            noOrders:true
          })
        }
        console.log("ORDERS:", orders);
        console.log("ORDERIDS:", orderIds);
        this.setState({
          orders:orders,
          orderIds:orderIds,
          allCards: orders.map(order => {
            return (
              <div style={{ padding: "15px" }}>
                <h3>
                  <br />
                  <br />
                  Order
                </h3>
                {order.map(product => {
                  console.log("Product:", product);
                  return (
                    <div style={{ padding: "15px" }}>
                      <h4>Product Name: {product.name}</h4>
                      <h6>Product Brand: {product.brand}</h6>
                      <h6>Product Description: {product.description}</h6>
                      <h6>Product Price: {product.price}</h6>
                      <h6>Product Quantity: {product.quantity} {product.unit}</h6>
                      <h6>Total Price: {product.total}</h6>
                    </div>
                  );
                })}
              </div>
            );
          })
        });
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

    if(this.state.noOrders){
      var noOrdersMessage = "There are no Fellow Poolers Orders available for pickup!"
    }
    return (
      <div className="mainDiv" style={{padding:"70px"}}>
        {redirectVar}
        {this.state.redirectToMyOrders}
        {this.state.redirectToStore}
        <Navbar />
        <div>
          <PerfectScrollbar
          onScrollY={container => console.log(`scrolled to: ${container.scrollTop}.`)}>
          <br/>
          <div style={{ width: "350px", margin: "0 auto" }}>
            <h4>Orders Available For Pickup</h4>
          </div>
          <div style={{ width: "750px", margin: "0 auto" }}>
            <br />
            <h4>How many orders are you willing to pickup for your fellow poolers?</h4>
          </div>
          <div style={{ width:"300px", margin: "0 auto" }}>
            <input
              type="Number"
              name="orderNumber"
              placeholder="Choose upto 10 orders..."
              max="10"
              min="0"
              style={{ width: "200px" }}
              onChange={this.onInputChangeHandler}
            ></input>
            <button
              class="btn btn-primary m-2 btn-sm"
              style={{ fontWeight: "bolder" }}
              onClick={this.validate}
            >
              Submit
            </button>&nbsp;&nbsp;
            <Link to="/myOrders">
            <button
              class="btn btn-danger m-2 btn-sm"
              style={{ fontWeight: "bolder" }}
              onClick={this.sendEmail}
            >
              Skip this step and Go to My Orders
            </button>
            </Link>
          </div>
          </PerfectScrollbar>
        </div>
        {this.state.allCards}
        <h5>{noOrdersMessage}</h5>
        <div>
          {
            // this.state.orders.map(item=>{
            //   return(
            //     <Card>
            //       <Card.Body>
            //         <Card.Title>Order</Card.Title>
            //         {/* {
            //           item.map(i=>{
            //             return(
            //               <Card.Text>
            //                 HII
            //               </Card.Text>
            //             )
            //           })
            //         } */}
            //       </Card.Body>
            //     </Card>
            //   )
            // })
          }
        </div>
        <hr></hr>
      </div>
    );
  }
}

export default AvailablePickups;
