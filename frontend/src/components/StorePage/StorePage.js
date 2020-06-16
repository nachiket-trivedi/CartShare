import React, { Component } from "react";
import { Col, Row, Container, ListGroup } from "react-bootstrap";
import "./StorePage.css";
import axios from "axios";
import { Redirect } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Navbar from '../Navbar/Navbar';
// import "react-dropdown/style.css";
import Jumbotron from 'react-bootstrap/Jumbotron';
import Card from 'react-bootstrap/Card';
import { serverIp, serverPort } from "../config";
const hostAddress= "" + serverIp + ":" + serverPort + "";
let response=[], quantityMap={}, store, jtron, cart={}, redirectToCart=null,  cartArr=[], orgStore
class StorePage extends Component {
    
constructor(props) {
    super(props);
    this.state = {
        allCards:null,
        response:{},
        redirectToStore:null,
        jtron:null,
        cards:null,
        quantityMap:{},
        cart:{},
        dataReceived: false,
        searchText:""
    };
    
  }

componentDidMount=()=>{
    let url=`${hostAddress}/store/${localStorage.getItem('storeId')}`
    axios.get(`${url}`)
    .then(response=>{
        console.log('respdata',response.data)
        store=response.data
        orgStore=Object.assign({}, store); 
        console.log('store', store)
        // if(this.state.dataReceived){
        console.log('sizee',store['name'])
        jtron=<Jumbotron>
          <h1>{store['name']}</h1>
          <div>
          <p>
              {store['description']}
          </p>
          <p>
              {store['address']['street']}, {store['address']['city']}, {store['address']['zip']} 
          </p>
          </div>
          <Button className="button2" variant="info" onClick={this.viewCart.bind(this)}>Go to Cart</Button>

        </Jumbotron>
        this.createCard(store, jtron)

        axios.post(hostAddress +"/checkUserPool",{email:localStorage.getItem("email")})
        .then(response=>{
          console.log("Pool Id from Backend:"+response.data);
          if(response.data == "notset"){
            
          }
          else{
            localStorage.setItem("pool",response.data);
          }
        }
        )
    })
  }
createCard=(store, jtron)=>{
    let cards=store['products'].map((item)=>{
        let id=item['id']['sku']+""+item['id']['store_id']
        let quantity=quantityMap[id]>0 ? quantityMap[id]: 0
        let image=item['imageURL']!=null && item['imageURL']!=""?item['imageURL']:"https://image.flaticon.com/icons/svg/1377/1377194.svg"
        return <Card className="indiCards" style={{ width: '18rem' }}>
            <Card.Img className="img" variant="top" src={image} />
        <Card.Body>
          <Card.Title>{item['name']}</Card.Title>
          <Card.Text>
            Description: {item['description']}
          </Card.Text>
          <Card.Text>
            Brand: {item['brand']} 
          </Card.Text>
          <Card.Text>
            Unit: {item['unit']} 
          </Card.Text>
          <Card.Text>
            Price per unit: {item['price']} 
          </Card.Text>
          <Button className="button1" variant="danger" onClick={this.subtractQuantity.bind(this, id)}>-</Button>
          {quantity}
          <Button className="button1" variant="primary" onClick={this.addQuantity.bind(this, id)}>+</Button>

          <Button className="button1" variant="success" onClick={this.addToCart.bind(this, item['id']['sku'], item['id']['store_id'], quantity, item['name'], item['description'], item['brand'], item['unit'], item['price'], store['name'])}>Add to Cart</Button>
        </Card.Body>
      </Card>
    })
    this.setState({
        jtron: jtron,
        cards: cards
        })
}

addToCart=(sku, storeId, quantity, name, des, brand, unit, price, storeName)=>{
    quantity= quantity==0 ? 1 : quantity
    localStorage.setItem('storeId', storeId)
    if(localStorage.getItem('pool')){
        let map=cart
        let poolId=localStorage.getItem('pool')
        let email=localStorage.getItem('email')
        let prodId=sku+""+storeId
        if( map!=undefined && prodId in map){
            quantity+=map[prodId]['quantity']
        }
        map[prodId]={
            poolId: poolId,
            email: email,
            quantity: quantity,
            sku: sku,
            storeId: storeId,
            name: name,
            des:des,
            brand:brand,
            unit:unit,
            price:price,
            storeName:storeName
        }
        console.log('map-',map)
        cart=map
         cartArr=[]
        for(let item in cart)
            cartArr.push(cart[item])
        console.log('cartArr', cartArr)
        this.createCard(store, jtron)
        cart=map

    }
    else{
        alert('Sorry, you cannot add to the cart as you are not a pool member :(')
    }
}
addQuantity=(id)=>{
    let newMap=quantityMap
    newMap[id]=newMap[id]>0 ? newMap[id]+1 : 1;
    quantityMap=newMap
    this.createCard(store, jtron)
    // this.setState({quantityMap:newMap})
    // console.log(this.state.quantityMap)
  }

subtractQuantity=(id)=>{
    let newMap=quantityMap
    newMap[id]=newMap[id]>0 ? newMap[id]-1 : 0;
    quantityMap=newMap
    this.createCard(store, jtron)
    // this.setState({quantityMap:newMap})
  }

viewCart=()=>{
  localStorage.setItem('cartArr', JSON.stringify(cartArr))
    redirectToCart= <Redirect to={{
        pathname: '/cartPage',
        state: {cart: cart, cartArr:cartArr}        
    }}/>
    this.setState({})
}
searchHandler=(e)=>{
    let searchText=e.target.value
    this.setState({searchText:searchText})
}
searchText=()=>{
    let searchText=this.state.searchText
    let newProdArr=[]
    for(let i in store['products']){
      console.log(i)
      if(store['products'][i]['name']==searchText){
        newProdArr.push(store['products'][i])
      }
    }
    store['products']=newProdArr
    console.log('store',store)
    this.createCard(store, jtron)
}
clearSearch=()=>{
  console.log('orgStore',orgStore)
  store=Object.assign({}, orgStore); 
  this.createCard(store, jtron)
}
  render() {
    if(!localStorage.getItem('email'))
    {redirectToCart=<Redirect to="/login"/>}
    return (
    <div className="mainDiv">
    {redirectToCart}
      <Navbar />
      
      <div className='leftalign'>
      {jtron}
      <Form className="form1">
        <Form.Group controlId="formBasicEmail" >
            <Form.Control placeholder="Search Product" onChange={this.searchHandler.bind(this)}/>
            <Form.Text className="text-muted" >
            </Form.Text>
        </Form.Group>

        <Button variant="primary" className="search-wale" onClick={this.searchText.bind(this)}>
            Search
        </Button>
        <Button variant="secondary" className="search-wale" onClick={this.clearSearch.bind(this)}>
            Clear
        </Button>
      </Form>
      </div>
      <div className='leftalign'>
      {this.state.cards}
      </div>
    </div>
  );
}
}

export default StorePage;