import React from "react";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText
} from "@trendmicro/react-sidenav";
import { Redirect } from "react-router";
import "./Navbar.css";
import "../CreditModal/CreditModal";
import CreditModal from "../CreditModal/CreditModal";
// import { Link } from 'react-router';

import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

require("@firebase/auth");
require("@firebase/firestore");
let redirectNav = null,
  selectedNav,
  navbarTag = null;

class Navbar extends React.Component {
  navHandler = e => {
    selectedNav = e;
    if (e === "home") {
      redirectNav = window.location.assign("/home");
    } else if (e == "browsePools") {
      redirectNav = <Redirect to="/browsePools" />;
    } else if (e == "myPool") {
      redirectNav = <Redirect to="/myPool" />;
    } else if (e == "messagePoolers") {
      redirectNav = <Redirect to="/messagePoolers" />;
    } else if (e == "profile") {
      redirectNav = <Redirect to="/profile" />;
    } else if (e == "pickup") {
      redirectNav = <Redirect to="/pickupStore" />;
    } else if (e == "markDelivery") {
      redirectNav = <Redirect to="/markDelivery" />;
    } else if (e === "logout") {
      localStorage.clear();
      firebase.default.auth().signOut();
      redirectNav = <Redirect to="/login" />;
    } else if (e === "pastOrders") {
      redirectNav = <Redirect to="/myOrders" />;
    }
    this.setState({});
  };

  render() {
    if (true) {
      navbarTag = (
        <SideNav
          onSelect={selected => {
            this.navHandler(selected);
          }}
        >
          <SideNav.Toggle />
          <SideNav.Nav selected={selectedNav}>
            <NavItem eventKey="home">
              <NavIcon>
                <i
                  className="fa fa-fw fa-home"
                  style={{ fontSize: "1.75em" }}
                />
              </NavIcon>

              <NavText>
                <b>Home</b>
              </NavText>
            </NavItem>

            <NavItem eventKey="myPool">
              <NavIcon>
                <i
                  className="fa fa-fw fa-angle-double-right"
                  style={{ fontSize: "1.75em" }}
                />
              </NavIcon>
              <NavText>
                <b>MyPool</b>
              </NavText>
            </NavItem>

            <NavItem eventKey="browsePools">
              <NavIcon>
                <i
                  className="fa fa-fw fa-search"
                  style={{ fontSize: "1.75em" }}
                />
              </NavIcon>
              <NavText>
                <b>Browse Pools</b>
              </NavText>
            </NavItem>
            <NavItem eventKey="messagePoolers">
              <NavIcon>
                <i className="fa fa-fw fa-sms" style={{ fontSize: "1.75em" }} />
              </NavIcon>
              <NavText>
                <b>Message Fellow Poolers</b>
              </NavText>
            </NavItem>
            <NavItem eventKey="pastOrders">
              <NavIcon>
                <i
                  className="fa fa-fw fa-list"
                  style={{ fontSize: "1.75em" }}
                />
              </NavIcon>
              <NavText>
                <b>My Past Orders</b>
              </NavText>
            </NavItem>
            <NavItem eventKey="pickup">
              <NavIcon>
                <i className="fas fa-truck" style={{ fontSize: "1.75em" }} />
              </NavIcon>
              <NavText>
                <b> Pick Ups</b>
              </NavText>
            </NavItem>
            <NavItem eventKey="markDelivery">
              <NavIcon>
                <i
                  className="fas fa-truck-loading"
                  style={{ fontSize: "1.75em" }}
                />
              </NavIcon>
              <NavText>
                <b> Deliver Items</b>
              </NavText>
            </NavItem>
            <NavItem eventKey="profile">
              <NavIcon>
                <i
                  className="fa fa-fw fa-id-card"
                  style={{ fontSize: "1.75em" }}
                />
              </NavIcon>
              <NavText>
                <b> Profile</b>
              </NavText>
            </NavItem>

            <NavItem>
              <NavIcon>
                <a
                  data-toggle="modal"
                  data-target="#creditModal"
                  href="#creditModal"
                >
                  {" "}
                  <i className="fas fa-donate" style={{ fontSize: "1.75em" }} />
                </a>
              </NavIcon>
              <NavText>
                <a
                  data-toggle="modal"
                  data-target="#creditModal"
                  href="#creditModal"
                >
                  <b>Contribution Credit</b>
                </a>
              </NavText>
            </NavItem>
            <NavItem eventKey="logout">
              <NavIcon>
                <i
                  className="fa fa-fw fa-sign-out-alt"
                  style={{ fontSize: "1.75em" }}
                />
              </NavIcon>
              <NavText>
                <b>Logout</b>
              </NavText>
            </NavItem>
          </SideNav.Nav>
        </SideNav>
      );
    }

    return (
      <div>
        <CreditModal />
        {redirectNav}
        {navbarTag}
      </div>
    );
  }
}
export default Navbar;
