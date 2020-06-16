import React, { Component } from "react";
import { Col, Row, Container, ListGroup } from "react-bootstrap";
import "./AdminProducts.css";
import axios from "axios";
import { Redirect } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "react-dropdown/style.css";
import Dropdown from "react-dropdown";
import Navbar from "../Navbar/HorizontalNav";
import { serverIp, serverPort } from "../config";
const hostAddress= "" + serverIp + ":" + serverPort + "";

class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: "",
      description: "",
      unit: "",
      price: "",
      sku: "",
      store: "",
      img: "",
      brand: "",
      stores: []
    };
    this.goToProductsPage = this.goToProductsPage.bind(this);
  }

  goToProductsPage = () => {
    return <Redirect to="/adminProducts" />;
  };

  roleChangeHandler = value => {
    this.setState({
      role: value
    });
    this.role.value = { value };
  };
  componentDidMount = () => {
    //Write code to retrieve all stores?
  };

  inputChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  removeStore = value1 => {
    console.log(value1);

    var t = this.state.stores.filter(
      value => value.storeId != value1.storeId
    );
    console.log(t);
    this.setState({
      stores: t
    });
  };

  searchStore = () => {
   console.log(this.state.store)
    axios.defaults.withCredentials = false;
    axios
      .get(hostAddress + `/getStoreFromName/${this.state.store}`)
      .then(response => {
        //alert(response.status);
        console.log("Response data after get Store -->" + response.data);

        this.setState({
          stores: this.state.stores.concat(response.data.store)
        });

        // window.location.reload();
      })
      .catch(err => {
        console.log(err.status);
        alert(err.response.data["error"]);
      });
  };

  addProduct = () => {

    var s=[];

    this.state.stores.map(i=>{
      s.push(i.storeId);
    })
    const data={
      name:this.state.productName,
      description: this.state.description,
      unit: this.state.unit,
      price: this.state.price,
      sku: this.state.sku,
      brand: this.state.brand,
      imageURL:this.state.img,
      stores: s.toString()
     } 
  
     console.log('addData',data);

     axios.defaults.withCredentials = false;
      axios
        .post(hostAddress + "/addProduct", data)
        .then(response => {
         // alert(response.status);
            console.log("Response data after add Product post-->" + response.data);
            alert("Product Added Successfully!");
         window.location.reload();
        })
        .catch(err => {
          console.log(err.status);
          alert(err.response.data["error"]);
        });
  }

  clearProduct = () => {
    window.location.reload();
  }
  render() {
    let redirectVar=null;
    if (localStorage.getItem("role") == "Admin") {
      if (localStorage.getItem("verified") != "true") {
        redirectVar = <Redirect to="/notVerified" />;
      } 
    } else if (localStorage.getItem("role") == "Pooler") {
     
        redirectVar = <Redirect to="/home" />;
    }
    let storeDetails = [];
    let details = null;
    console.log("bleh:", this.state.stores);
    if (this.state.stores != []) {
      details = this.state.stores.map(listItem => {
        console.log("Hello:", listItem);

        storeDetails.push(
          <span>
            <button
              class="tagbutton"
              name={listItem.storeId}
              onClick={this.removeStore.bind(this, listItem)}
            >
              <span>
                <b style={{ fontSize: "12px", marginRight: "3px" }}>
                  {listItem.name}
                </b>
              </span>

              <span
                style={{ fontSize: "14px", marginTop: "2%", float: "right" }}
              >
                <i class="far fa-times-circle"></i>
              </span>
            </button>
          </span>
        );
      });
    }

    return (
      <div className="mainDiv">
        {redirectVar}
        <Navbar />
        <br></br>
        <div>
          <a href="/adminProducts">
            <Button className="buttonButton2"> Back </Button>{" "}
          </a>
        </div>
        <div className="addForm">
          <Container>
            <div>
              <h5>Add Product</h5>
              <Form>
                <Form.Row>
                  <Form.Control
                  required
                    placeholder="Product Name"
                    name="productName"
                    id="productName"
                    onChange={this.inputChangeHandler.bind(this)}
                  />
                </Form.Row>
                <br></br>
                <Form.Row>
                  <Form.Control
                  required
                    placeholder="Description"
                    name="description"
                    id="description"
                    onChange={this.inputChangeHandler.bind(this)}
                  />
                </Form.Row>
                <br></br>
                <Form.Row>
                  <Form.Control
                    placeholder="Brand"
                    name="brand"
                    id="brand"
                    onChange={this.inputChangeHandler.bind(this)}
                  />
                </Form.Row>
                <br></br>
                <Form.Row>
                  <Form.Control
                    placeholder="img"
                    name="img"
                    id="img"
                    onChange={this.inputChangeHandler.bind(this)}
                  />
                </Form.Row>
                <br></br>
                <Form.Row>
                  <Col>
                    <Form.Control
                    required
                      placeholder="Unit"
                      name="unit"
                      id="unit"
                      onChange={this.inputChangeHandler.bind(this)}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                    required
                      placeholder="Price"
                      name="price"
                      id="price"
                      onChange={this.inputChangeHandler.bind(this)}
                    />
                  </Col>
                </Form.Row>
                <br></br>
                <Form.Row>
                  <Col>
                    <Form.Control
                  
                      placeholder="Store Name"
                      name="store"
                      id="store"
                      onChange={this.inputChangeHandler.bind(this)}
                    />
                  </Col>
                  <Col>
                    <Button
                      className="buttonButton"
                      onClick={this.searchStore.bind(this)}
                    >
                      Search
                    </Button>
                  </Col>
                </Form.Row>
                <br></br>
                {details}
                {storeDetails}
                <br></br>
                <br></br>
                <Form.Row>
                  <Col>
                    <Form.Control
                      placeholder="SKU"
                      name="sku"
                      id="sku"
                      onChange={this.inputChangeHandler.bind(this)}
                    />
                  </Col>
                </Form.Row>
                <br></br>
                <span>
                  <Button className="buttonButton" onClick={this.addProduct}>Add</Button>
                </span>
                <span>
                  <Button className="cancelButton" onClick={this.clearProduct}>Clear</Button>
                </span>
              </Form>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}

export default AddProduct;
