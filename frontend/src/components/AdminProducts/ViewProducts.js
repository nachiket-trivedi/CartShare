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
import "./AdminProducts.css";
import axios from "axios";
import { Redirect } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "react-dropdown/style.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import { serverIp, serverPort } from "../config";
const hostAddress= "" + serverIp + ":" + serverPort + "";
let delFlag = false;

class ViewProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editFlag: null,
      name: "",
      unit: "",
      brand: "",
      description: "",
      store: "",
      productList: [],
      search: "",
      searchType: "",
      searchList: ["name", "store", "sku"],
      image: ""
    };
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.cancelChanges = this.cancelChanges.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.searchChangeHandler = this.searchChangeHandler.bind(this);
    this.searchItem = this.searchItem.bind(this);
  }

  componentDidMount = () => {
    axios.defaults.withCredentials = false;
    axios
      .get(hostAddress + "/getAllProducts")
      .then(response => {
        // alert(response.status);
        console.log("Response data after get Product-->" + response.data);
        this.setState({
          productList: this.state.productList.concat(response.data.Products)
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          storeMessage: "Cannot display Products right now!:("
        });
        //alert(err.response.data["error"]);
      });
  };

  searchChangeHandler = e => {
    console.log("e in searchChangeHandler");
    console.log(e);
    this.setState({
      searchType: e.value
    });
    this.searchType.value = { e };
  };

  inputChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  updateProduct = e => {
    //alert(e)
    this.setState({
      editFlag: e
    });
  };

  cancelChanges = value => {
    this.setState({
      editFlag: null
    });
  };

  saveChanges = value => {
    const data = {
      store: value.id.store_id,
      sku: value.id.sku,
      name: this.state.name,
      description: this.state.description,
      brand: this.state.brand,
      unit: this.state.unit,
      price: this.state.price,
      imageURL: this.state.image
    };

    console.log('update data',data);
    axios.defaults.withCredentials = false;
    axios
      .put(hostAddress + "/updateProduct", data)
      .then(response => {
        if (response.status == 202) {
          alert("Product Updated Successfully!");
        }
        // this.setState({

        // });
        window.location.reload();
      })
      .catch(err => {
        console.log(err.status);
        alert(err.response.data["error"]);
      });
    this.setState({
      editFlag: null
    });
  };

  deleteProduct = value => {
    axios
      .delete(
        hostAddress + `/deleteProduct/${value.id.sku}/${value.id.store_id}`
      )
      .then(response => {
        // alert(response.status);
        console.log(
          "Response data after delete Product post-->" + response.data
        );
        alert("Product Deleted Successfully!");
        window.location.reload();
      })
      .catch(err => {
        console.log(err.status);
        alert(err.response.data["error"]);
        window.location.reload();
      });

    delFlag = true;
    this.setState({});
  };

  searchItem = () => {
    axios.defaults.withCredentials = false;
    axios
      .get(
        hostAddress +
          `/searchProduct/${this.state.search}/${this.state.searchType}`
      )
      .then(response => {
        // alert(response.status);
        console.log("Response data after get Product-->" + response.data);
        this.setState({
          productList: response.data.products
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          storeMessage: "Cannot display Products right now!:(",
          productList: []
        });
        //alert(err.response.data["error"]);
      });
  };

  clearForm = () => {
    window.location.reload();
  };

  render() {
    let displayDetails = [];
    let details = null;
    let redirectVar = null;
    if (localStorage.getItem("role") == "Admin") {
      if (localStorage.getItem("verified") != "true") {
        redirectVar = <Redirect to="/notVerified" />;
      }
    } else if (localStorage.getItem("role") == "Pooler") {
      redirectVar = <Redirect to="/home" />;
    }
    details = this.state.productList.map(item => {
      if (this.state.editFlag != item) {
        
        displayDetails.push(
          <tr>
            {/* <td>item.imageURL}</td> */}
            <td><img className="image" src={item.imageURL}/></td>
            <td>{item.name}</td>
            <td>{item.description}</td>
            <td>{item.brand}</td>
            <td>{item.unit}</td>
            <td>{item.price}</td>
            <td>
              {item.store.storeId}
              {" - "}
              {item.store.name}
            </td>
            <td>{item.id.sku}</td>

            <td>
              <span>
                <button
                  style={{ border: "none", marginRight: "8px" }}
                  class="fas fa-pencil-alt"
                  onClick={this.updateProduct.bind(this, item)}
                ></button>
              </span>
              <span>
                <button
                  style={{ border: "0px", marginLeft: "8pxpx" }}
                  class="fas fa-trash-alt"
                  onClick={this.deleteProduct.bind(this, item)}
                ></button>
              </span>
            </td>
          </tr>
        );
      } else {
        if (this.state.editFlag == item) {
          displayDetails.push(
            <tr>
              <td>
                <input
                  type="text"
                  placeholder={item.imageURL}
                  onChange={this.inputChangeHandler.bind(this)}
                  name="image"
                  id="image"
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder={item.name}
                  onChange={this.inputChangeHandler.bind(this)}
                  name="name"
                  id="name"
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder={item.description}
                  onChange={this.inputChangeHandler.bind(this)}
                  name="description"
                  id="description"
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder={item.brand}
                  onChange={this.inputChangeHandler.bind(this)}
                  name="brand"
                  id="brand"
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder={item.unit}
                  onChange={this.inputChangeHandler.bind(this)}
                  name="unit"
                  id="unit"
                />
              </td>
              <td>
                <input
                  type="number"
                  placeholder={item.price}
                  onChange={this.inputChangeHandler.bind(this)}
                  name="price"
                  id="price"
                />
              </td>
              <td>{item.id.store_id}</td>
              <td>{item.id.sku}</td>
              <td>
                <span>
                  <button
                    style={{ border: "none", marginRight: "8px" }}
                    class="fas fa-save"
                    onClick={this.saveChanges.bind(this, item)}
                  ></button>
                </span>
                <span>
                  <button
                    style={{ border: "0px", marginLeft: "8pxpx" }}
                    class="fas fa-times"
                    onClick={this.cancelChanges.bind(this, item)}
                  ></button>
                </span>
              </td>
            </tr>
          );
        } else {
          displayDetails.push(
            <tr>
              <td><img className="image" src={item.imageURL}/></td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.brand}</td>
              <td>{item.unit}</td>
              <td>{item.price}</td>
              <td>
                {item.store.storeId}
                {" - "}
                {item.store.name}
              </td>
              <td>{item.id.sku}</td>
              <td>
                <span>
                  <button
                    style={{ border: "none", marginRight: "8px" }}
                    class="fas fa-pencil-alt"
                    onClick={this.updateProduct.bind(this, item)}
                  ></button>
                </span>
                <span>
                  <button
                    style={{ border: "0px", marginLeft: "8pxpx" }}
                    class="fas fa-trash-alt"
                    onClick={this.deleteProduct.bind(this, item)}
                  ></button>
                </span>
              </td>
            </tr>
          );
        }
      }
    });

    let tableDetails = null;
    if (this.state.productList.length == 0) {
      tableDetails = (
        <div>
          <center>
            <br></br>
            <h4>Nothing to show!:(</h4>
          </center>
        </div>
      );
    } else {
      tableDetails = (
        <Table responsive style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Brand</th>
              <th>Unit</th>
              <th>Price</th>
              <th>Store</th>
              <th>SKU</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {details}
            {displayDetails}
          </tbody>
        </Table>
      );
    }

    return (
      <div className="mainDiv">
        {redirectVar}
        <Container>
          <div>
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Search"
                  onChange={this.inputChangeHandler.bind(this)}
                  name="search"
                  id="search"
                />
              </Col>

              <Col>
                <Dropdown
                  options={this.state.searchList}
                  name="searchType"
                  placeholder="Search"
                  ref={ref => (this.searchType = ref)}
                  onChange={this.searchChangeHandler}
                  value={this.state.searchType}
                  required
                />
              </Col>
              <Col>
                <span>
                  <Button className="buttonButton" onClick={this.searchItem}>
                    Search
                  </Button>
                </span>
                <span>
                  <Button className="cancelButton" onClick={this.clearForm}>
                    Reset
                  </Button>
                </span>
              </Col>
            </Row>
          </div>
          <br></br>
          <h4>
            <b>Products List</b>
          </h4>

          {tableDetails}
        </Container>
      </div>
    );
  }
}

export default ViewProducts;
