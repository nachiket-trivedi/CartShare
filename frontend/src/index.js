import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Home from "./components/Home/Home";
import BrowsePools from "./components/BrowsePools/BrowsePools";
import AdminProducts from "./components/AdminProducts/AdminProducts";
import AdminStores from "./components/AdminStores/AdminStores";
import MyPool from "./components/MyPool/MyPool";
import CreditModal from "./components/CreditModal/CreditModal";
import AddProduct from "./components/AdminProducts/AddProduct";
import AdminHome from "./components/AdminHome/AdminHome";
import AllStores from "./components/AllStores/AllStores";
import StorePage from "./components/StorePage/StorePage";
import CartPage from "./components/CartPage/CartPage";
import MyOrders from "./components/MyOrders/MyOrders";
import Profile from "./components/Profile/Profile";
import AvailablePickups from "./components/AvailablePickups/AvailablePickups";
import PickUpStores from "./components/PickupStores/PickupStores";
import MarkDelivery from "./components/MarkDelivery/MarkDelivery";
import NotVerified from "./components/NotVerifiedPage";
import MessagePoolers from "./components/MessagePoolers/MessagePoolers";

class Routes extends React.Component {
  render() {
    return (
      <Router>
        {/* <Route path="/" component={Login} /> */}
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/browsePools" component={BrowsePools} />
        <Route path="/adminStores" component={AdminStores} />
        <Route path="/addProduct" component={AddProduct} />
        <Route path="/adminHome" component={AdminHome} />
        <Route path="/adminProducts" component={AdminProducts} />
        <Route path="/myPool" component={MyPool} />
        <Route path="/credit" component={CreditModal} />
        <Route path="/allStores" component={AllStores} />
        <Route path="/StorePage" component={StorePage} />
        <Route path="/home" component={AllStores} />
        <Route path="/cartPage" component={CartPage} />
        <Route path="/myOrders" component={MyOrders} />
        <Route path="/notVerified" component={NotVerified} />
        <Route path="/profile" component={Profile} />
        <Route path="/availablePickups" component={AvailablePickups} />
        <Route path="/pickupStore" component={PickUpStores} />
        <Route path="/markDelivery" component={MarkDelivery} />
        <Route path="/messagePoolers" component={MessagePoolers} />
      </Router>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
