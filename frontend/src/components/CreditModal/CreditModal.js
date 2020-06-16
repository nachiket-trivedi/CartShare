import React,{Component} from 'react';
import './creditModal.css';
import axios from 'axios';
import { serverIp, serverPort } from "../config";
const hostAddress= "" + serverIp + ":" + serverPort + "";


export default class CreditModal extends Component{

    constructor(props){

        super(props);
        this.state={

          credits:0
        }
    }

    componentDidMount(){

      const data = {

        email:localStorage.getItem("email")
      }
      //const email = "kanika.khanna.k2@gmail.com";
      axios.post(hostAddress+'/credits',data)
      .then(response =>{

        console.log("Credit response:", response);
        console.log("Credit:",response.data);
        this.setState({
          credits:response.data
        })
      })
    }

    render(){

      const credits= this.state.credits;
      let statusColor="green";
      if(credits>-6 && credits<=-4 ){
        statusColor="#f8f04d";
      }
      if(credits<=-6){
        statusColor="#df2727";
      }
      
        return(

      <div class="container">
        <div class="modal fade" id="creditModal">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h3 class="modal-title">My Contribution Score</h3>
                <br />
                <button type="button" class="close" data-dismiss="modal">
                  &times;
                </button>
              </div>

              <div class="modal-body">
              <h5>
                 Contribution Credits:  {this.state.credits}
                </h5>
                <h5>
                 Contribution Status:   <button style={{backgroundColor:statusColor,padding:"10px 24px"}}></button>
                </h5>
              </div>

              <div class="modal-footer">
                <button
                  type="button"
                  class="backButton"
                  data-dismiss="modal" 
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
        )
    }
}