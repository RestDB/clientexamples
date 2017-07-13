// App.js
import React, { Component } from 'react';
import _ from 'lodash';
import logo from './logo.svg';
import './App.css';
import Trade from './Autotrader';
import { restdb, realtimeURL } from './helper.js';


class Tickers extends Component {
  constructor(props) {
    super(props);
    
    this.state = {ping: new Date(), evt: '', tickers: []};
    
    // connect to the realtime database stream
    let eventSource = new EventSource(realtimeURL);

    // check if the realtime connection is dead, reload client if dead
    setInterval(() => {
      let now = new Date().getTime();
      let diff = (now - this.state.ping.getTime()) / 1000;
      
      // haven't heard from the server in 20 secs?
      if (diff > 20) {
        // hard reload of client
        window.location.reload();
      }
    }, 10000);
    
    // listen on ping from server, keep time
    eventSource.addEventListener('ping', function(e) {
        this.setState(previousState => {
          return {ping: new Date(e.data)};
        });
    }.bind(this), false);
    
    // listen for database REST operations
    eventSource.addEventListener('put', (e) => {
        this.getTickerData()
        
    }, false);
    
    eventSource.addEventListener('delete', (e) => {
        this.getTickerData()
        
    }, false);

    eventSource.addEventListener('post', (e) => {
        this.getTickerData();
        
    }, false);

    eventSource.addEventListener("error", (e) => {
      // typically lost network connection
      console.log("Error", e);
    });

    eventSource.onmessage = (e) => {
        // generic messages
        console.log("Message", e);
    }
  }

  // GET 20 stocks to display and trade
  getTickerData = () => {
    restdb.get("/rest/nasdaq?sort=symbol&max=20&metafields=true")
      .then(res => {
        let now = new Date().getTime();
        let tickers = res.data;
        let diff = null;
        
        // tag stocks that are changed in the last 10 secs
        _.each(tickers, (t) => {
          diff = (now - new Date(t._changed).getTime()) / 1000;
          if (diff < 10) {
            t.isChanged = true;
          } else {
            t.isChanged = false;
          }
        });
        
        this.setState(previousState => {
          return { tickers };
        });
      });
  }
  componentDidMount() {
    console.log("Start client");
    this.getTickerData();
  }

  render() {
    return (
      <div className="tickers">
        <table className="table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Company</th>
              <th className="num">Price</th>
              <th className="num">Change</th>
            </tr>
          </thead>
          <tbody>
            
            {this.state.tickers.map(tic =>
              
              <tr key={tic._id} className={tic.isChanged ? (tic['net chg'] > 0 ? "up" : "down") : "passive"}> 
                <td>{tic.symbol}</td>
                <td>{tic.name}</td>
                <td className="num">{tic.price.toFixed(2) || 0.0}</td>
                <td className="num">{tic['net chg'] ? tic['net chg'].toFixed(2) : 0.0}</td>
              </tr>
            )}
            
          </tbody>
        </table>
      </div>
    );
  }
}

class App extends Component {
  componentDidMount() {
    // start trading
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React &amp; RestDB.io in Realtime</h2>
        </div>
        
        <h2>Nasdaq trading bots <small>fake</small></h2>
        <Trade/>
        <Tickers/>
      </div>
    );
  }
}

export default App;
