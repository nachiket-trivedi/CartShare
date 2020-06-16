import React, { Component } from "react";
import { Col, Row, Container, ListGroup, Table } from "react-bootstrap";
import "./AdminStores.css";
import axios from "axios";
import { Redirect } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "react-dropdown/style.css";
import { serverIp, serverPort } from "../config";
const hostAddress= "" + serverIp + ":" + serverPort + "";
let delFlag = false;

class ViewStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editFlag: null,
      storeList: [],
      storeMessage: "",
      name: "",
      street: "",
      state: "",
      city: "",
      zip: ""
    };
    this.updateStore = this.updateStore.bind(this);
    this.deleteStore = this.deleteStore.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.cancelChanges = this.cancelChanges.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
  }
  componentDidMount = () => {
    axios.defaults.withCredentials = false;
    axios
      .get(hostAddress + "/getAllStores")
      .then(response => {
        // alert(response.status);
        console.log("Response data after get Store post-->" + response.data);
        this.setState({
          storeList: this.state.storeList.concat(response.data.Stores)
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          storeMessage: "Cannot display Stores right now!:("
        });
        //alert(err.response.data["error"]);
      });
  };

  inputChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  updateStore = e => {
    this.setState({
      editFlag: e
    });
  };

  cancelChanges = value => {
    this.setState({
      editFlag: null,
      name: "",
      street: "",
      zip: "",
      city: "",
      state: ""
    });
  };

  saveChanges = value => {
    const data = {
      id: value,
      name: this.state.name,
      street: this.state.street,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip
    };

    console.log(data);
    axios.defaults.withCredentials = false;
    axios
      .put(hostAddress + "/updateStore", data)
      .then(response => {
        if (response.status == 202) {
          alert("Store Updated Successfully!");
        }
        this.setState({
          name: response.data.store.name,
          state: response.data.store.address.state,
          city: response.data.store.address.city,
          street: response.data.store.address.street,
          zipcode: response.data.store.address.zip
        });
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

  deleteStore = value => {
    const data = {
      id: value
    };
    // const url = `http://localhost:3000/movies/${movie.id}`;
    axios
      .delete(hostAddress + `/deleteStore/${value}`)
      .then(response => {
        // alert(response.status);
        console.log("Response data after delete Store post-->" + response.data);
        alert("Store Deleted Successfully!");
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

  render() {
    let displayDetails = [];
    let details = null;
    let redirectVar=null;
    if (localStorage.getItem("role") == "Admin") {
      if (localStorage.getItem("verified") != "true") {
        redirectVar = <Redirect to="/notVerified" />;
      } 
    } else if (localStorage.getItem("role") == "Pooler") {
     
        redirectVar = <Redirect to="/home" />;
    }
    details = this.state.storeList.map(item => {
      if (this.state.editFlag == null) {
        displayDetails.push(
          <tr>
            <td>{item.storeId}</td>
            <td>{item.name}</td>
            <td>{item.address.street}</td>
            <td>{item.address.city}</td>
            <td>{item.address.state}</td>
            <td>{item.address.zip}</td>

            <td>
              <span>
                <button
                  style={{ border: "none", marginRight: "8px" }}
                  class="fas fa-pencil-alt"
                  onClick={this.updateStore.bind(this, item.storeId)}
                ></button>
              </span>
              <span>
                <button
                  style={{ border: "0px", marginLeft: "8pxpx" }}
                  class="fas fa-trash-alt"
                  onClick={this.deleteStore.bind(this, item.storeId)}
                ></button>
              </span>
            </td>
          </tr>
        );
      } else {
        if (this.state.editFlag == item.storeId) {
          //some email condition
          displayDetails.push(
            <tr>
              <td>{item.storeId}</td>
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
                  placeholder={item.address.street}
                  onChange={this.inputChangeHandler.bind(this)}
                  name="street"
                  id="street"
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder={item.address.city}
                  onChange={this.inputChangeHandler.bind(this)}
                  name="city"
                  id="city"
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder={item.address.state}
                  onChange={this.inputChangeHandler.bind(this)}
                  name="state"
                  id="state"
                />
              </td>
              <td>
                <input
                  type="number"
                  placeholder={item.address.zip}
                  onChange={this.inputChangeHandler.bind(this)}
                  name="zip"
                  id="zip"
                />
              </td>
              <td>
                <span>
                  <button
                    style={{ border: "none", marginRight: "8px" }}
                    class="fas fa-save"
                    onClick={this.saveChanges.bind(this, item.storeId)}
                  ></button>
                </span>
                <span>
                  <button
                    style={{ border: "0px", marginLeft: "8pxpx" }}
                    class="fas fa-times"
                    onClick={this.cancelChanges.bind(this, item.storeId)}
                  ></button>
                </span>
              </td>
            </tr>
          );
        } else {
          displayDetails.push(
            <tr>
              <td>{item.storeId}</td>
              <td>{item.name}</td>
              <td>{item.address.street}</td>
              <td>{item.address.city}</td>
              <td>{item.address.state}</td>
              <td>{item.address.zip}</td>

              <td>
                <span>
                  <button
                    style={{ border: "none", marginRight: "8px" }}
                    class="fas fa-pencil-alt"
                    onClick={this.updateStore.bind(this, item.storeId)}
                  ></button>
                </span>
                <span>
                  <button
                    style={{ border: "0px", marginLeft: "8pxpx" }}
                    class="fas fa-trash-alt"
                    onClick={this.deleteStore.bind(this, item.storeId)}
                  ></button>
                </span>
              </td>
            </tr>
          );
        }
      }
    });

    let tableDetails = (
      <Table responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Zipcode</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {details}
          {displayDetails}
        </tbody>
      </Table>
    );
    return (
      <div className="mainDiv">
        {redirectVar}
        <Container>
          <h4>
            <b>Stores List</b>
          </h4>
          <br></br>
          {tableDetails}
        </Container>
      </div>
    );
  }
}

export default ViewStores;
