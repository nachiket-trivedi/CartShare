import React, { Component } from "react";
import { Col, Row, Container, ListGroup } from "react-bootstrap";
import "./CartPage.css";
import axios from "axios";
import { Redirect } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Navbar from "../Navbar/Navbar";
// import "react-dropdown/style.css";
import Jumbotron from "react-bootstrap/Jumbotron";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import CreditModal from "../CreditModal/CreditModal";
import Swal from "sweetalert2";
import { serverIp, serverPort } from "../config";
const hostAddress= "" + serverIp + ":" + serverPort + "";

let response = [],
  quantityMap = {},
  store,
  jtron,
  cart,
  cartArr,
  redirectToModal = null,
  table,
  totPrice = 0,
  delPoolerChecked = false,
  redirectToLogin = null;
class CartPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCards: null,
      response: {},
      redirectToStore: null,
      jtron: null,
      cards: null,
      quantityMap: {},
      cart: {},
      dataReceived: false,
      show: false,
      redirectToSelfPick: null,
      credits:0,
      flag:false,
      redirectToMyOrders:null,
      placedOrderId:null
    };
  }

  componentDidMount = () => {
    cartArr = JSON.parse(localStorage.getItem('cartArr'));
    this.createTable(cartArr);
  };
  createTable = (cartArr) => {
    console.log("cartArr", cartArr);
    let i = 1;
    totPrice = 0;
    let tabBody = cartArr.map(item => {
      console.log("item", item);
      totPrice += item["price"] * item["quantity"];
      return (
        <tbody>
          <tr>
            <td>{i++}</td>
            <td>{item["name"]}</td>
            <td>{item["des"]}</td>
            <td>{item["price"]}</td>
            <td>{item["unit"]}</td>
            <td>
              <Button
                className="button1"
                variant="danger"
                onClick={this.subtractQuantity.bind(this, item["name"])}
              >
                -
              </Button>
              {item["quantity"]}
              <Button
                className="button1"
                variant="primary"
                onClick={this.addQuantity.bind(this, item["name"])}
              >
                +
              </Button>
            </td>
            <td>{item["price"] * item["quantity"]}</td>
            <td>
              <Button
                className="button2"
                variant="warning"
                onClick={this.removeFromCart.bind(this, item["name"])}
              >
                Remove
              </Button>
            </td>
          </tr>
        </tbody>
      );
    });

    table = (
      <Table responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Unit</th>
            <th>Quantity</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        {tabBody}
      </Table>
    );
    this.setState({});
  };

  addQuantity = name => {
    let newArr = cartArr;
    newArr.map(item => {
      if (item["name"] == name) item["quantity"] += 1;
    });
    cartArr = newArr;
    this.createTable(cartArr);
  };

  subtractQuantity = name => {
    let newArr = cartArr;
    newArr.map(item => {
      if (item["name"] == name)
        item["quantity"] = item["quantity"] == 0 ? 0 : item["quantity"] - 1;
    });
    cartArr = newArr;
    this.createTable(cartArr);
  };
  removeFromCart = name => {
    let newArr = cartArr;
    newArr.map(item => {
      if (item["name"] == name) {
        const index = newArr.indexOf(item);
        if (index > -1) {
          newArr.splice(index, 1);
        }
      }
    });
    cartArr = newArr;
    this.createTable(cartArr);
  };
  placeOrder = () => {
    axios.post(hostAddress+"/checkZipcode",{email:localStorage.getItem("email")}).then(response=>{

      if(response.data == "notset"){

        alert('Please enter address first')
      }
      else if(response.data == "set"){
        cartArr.push({ totPrice: totPrice + (9.5 * totPrice) / 100 });
        let deliveryPoolerEmail = delPoolerChecked
          ? localStorage.getItem("email")
          : "";
        // cartArr.push({deliveryPoolerEmail:deliveryPoolerEmail})
        console.log("final Cart", cartArr);
        axios.post(hostAddress +"/placeOrder", cartArr).then(response => {
          console.log("response data", response.data);
          this.setState({
            placedOrderId:response.data
          })
          // const [modalShow, setModalShow] = React.useState(false);
          // redirectToModal=<Redirect to=''/>
          this.showModal();
          this.setState({});
        });
      }
    })
  //   if(!localStorage.getItem('zipcode'))
  //     alert('Please enter address first')
  //   else{
  //   cartArr.push({ totPrice: totPrice + (9.5 * totPrice) / 100 });
  //   let deliveryPoolerEmail = delPoolerChecked
  //     ? localStorage.getItem("email")
  //     : "";
  //   // cartArr.push({deliveryPoolerEmail:deliveryPoolerEmail})
  //   console.log("final Cart", cartArr);
  //   axios.post(hostAddress +"/placeOrder", cartArr).then(response => {
  //     console.log("response data", response.data);
  //     // const [modalShow, setModalShow] = React.useState(false);
  //     // redirectToModal=<Redirect to=''/>
  //     this.showModal();
  //     this.setState({});
  //   });
  // }
  };
  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    cartArr.pop()
    localStorage.setItem('cartArr',JSON.stringify(cartArr))
    window.location.reload();
    // this.setState({ show: false });
  };
  selfPickupCaller = () => {
    axios.post(hostAddress +'/setSelfOrderDetails',{
      email:localStorage.getItem("email"),placedOrderId:this.state.placedOrderId
    }).then(response =>{
      this.setState({ redirectToSelfPick: <Redirect to="/availablePickups" /> });

    })
    
  };

  fellowPickupCaller =()=>{
    axios.post(hostAddress +'/credits',{
        email:localStorage.getItem("email")
      })
      .then(response =>{

        console.log("Credit response:", response);
        console.log("Credit:",response.data);
        this.setState({
          credits:response.data,
          
        })
        var col="green";
        if(response.data>-6 && response.data<=-4){
          col="yellow";
        }
        if(response.data<=-6){
          col="red"
        }
         
        Swal.fire({
          icon: "info",
          title: "Reminder",
          footer:"Your Contribution Credits: "+response.data,
          html:`<button class="swalButton" style="background-color:${col};padding:20px"></button>`,
          
        }).then(result=>{

          if(response.data<=-4){ 
          Swal.fire({
            icon: "warning",
            title: "You will lose one Contribution Credit point if you agree to continue",
          }).then(r=>{

            axios.post(hostAddress +"/fellowPickup",{email:localStorage.getItem("email")})
            .then(response=>{

              console.log("updated the credit for this user since it was more than -4");
             // this.hideModal();
             this.setState({ redirectToMyOrders: <Redirect to="/myOrders" /> });
            })

          })
        }
        else{

          axios.post(hostAddress +"/fellowPickup",{email:localStorage.getItem("email")})
            .then(response=>{

              console.log("updated the credit for this user since it was less than -4");
             // this.hideModal();
             this.setState({ redirectToMyOrders: <Redirect to="/myOrders" /> });
            })
          }
        })

      })

    }
  

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
    return (
      <div className="mainDiv">
        {redirectVar}
        {this.state.redirectToSelfPick}
        {this.state.redirectToMyOrders}
        <Modal
          show={this.state.show}
          handleClose={this.hideModal}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Yay! Order successfully placed
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>Let's select a pickup option :D</h6>
            <Button
              className="pickupBtn"
              variant="primary"
              onClick={this.selfPickupCaller.bind(this)}
            >
              Opt for Self-Pickup
            </Button>
            <Button className="pickupBtn" variant="danger" onClick={this.fellowPickupCaller.bind(this)}>
              Let Fellow Pooler Pick
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.hideModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Navbar />
        <div className="leftalign">
          <Jumbotron>
            <h1>Review order</h1>
            <div>{/* <p>
              
          </p> */}</div>
          </Jumbotron>
          {/* {this.state.cards} */}
          {table}
          {/* <hr></hr>
      <Form className='form1'>
          <div key={`default-${'checkbox'}`} className="mb-3">
            <Form.Check 
              type={'checkbox'}
              id={`default-${'checkbox'}`}
              label='Become the Delivery Pooler'
              onChange={()=>{delPoolerChecked=true}}
            />
          </div>
      </Form> */}
          <hr></hr>
          <div className="div1">
            <b>Total: ${totPrice}</b>
            <br/>
            Tax (9.25%): ${(9.25 * totPrice) / 100}
            <br />
            Convenience (0.5%): ${(0.25 * totPrice) / 100}
            <br />
            <br />
            <h5>
              <b>Final Amount: ${totPrice + (9.5 * totPrice) / 100}</b>
            </h5>
            <br />
          </div>
          <Button
            className="button3"
            variant="primary"
            onClick={this.placeOrder.bind(this)}
          >
            Place Order
          </Button>
        </div>
      </div>
    );
  }
}

export default CartPage;
