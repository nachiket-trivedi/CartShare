import React, { Component } from "react";
import "./AdminHome.css";
import { Redirect } from "react-router";
import Button from "react-bootstrap/Button";
import { Col, Row, Container, ListGroup, Table,CardColumns,Card,CardDeck } from "react-bootstrap";
import Navbar from '../Navbar/HorizontalNav';


class AdminHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

 
  componentDidMount = () => {
    //alert(localStorage.getItem("verified"))
  };


  render() {
    let displayDetails = null;
    let redirectVar=null;
    if (localStorage.getItem("role") == "Admin") {
      if (localStorage.getItem("verified")==false) {
        redirectVar = <Redirect to="/notVerified" />;
      }else if(localStorage.getItem("verified")==true){

      }else if(localStorage.getItem("verified")==null){

      } 
    } else if (localStorage.getItem("role") == "Pooler") {
        redirectVar = <Redirect to="/home" />;
    }else{
      redirectVar = <Redirect to="/login" />;
    }
    return (
    <div className="mainDiv">
      {redirectVar}
      <Navbar />
      <br></br>
      <br>
      </br>
      <Container>
      <CardDeck>

  <Card>
      
    <Card.Img variant="top" style={{height:"80%", width:"100%"}} src="https://media1.s-nbcnews.com/i/newscms/2019_49/3133051/191204-dollar-general-se-132p_be973efa5ab4c4c36252c1b2464e41d0.jpg" />
    
    <Card.Body>
        <center>
            <a href="/adminStores"><Card.Title>Stores</Card.Title></a>
            
      </center>
    </Card.Body>
    
  </Card>
  <Card>
    <Card.Img variant="top" style={{height:"80%",width:"100%"}} src="https://tinobusiness.com/wp-content/uploads/2015/09/CONSUMER-PRODUCTS-e1442909155136.jpg" />
    <Card.Body>
        <center>
        <a href="/adminProducts"><Card.Title>Products</Card.Title></a>
        </center>
    </Card.Body>
  </Card>
 
</CardDeck>
      </Container>
     
   
    </div>
  );
}
}

export default AdminHome;