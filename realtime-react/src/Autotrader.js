import React, { Component } from 'react';
import { restdb, trade_delay } from './helper.js';

// emulate price change on stocks
class Trader extends Component {
    constructor(props) {
        super(props);
        this.state = {stocks: [], lasttrade: null};
        
        // GET 20 stocks
        restdb.get("/rest/nasdaq?sort=symbol&max=20")
        .then(res => {
            const stocks = res.data;
            this.setState(previousState => {
                return { stocks };
            });
        });

        // update a random stock each 10 sec
        setInterval(() => {
            let stockpos = Math.floor(Math.random() * 19);
            if (this.state.stocks[stockpos]) {
                let stockID = this.state.stocks[stockpos]._id;
                let newprice = (Math.random() * 1000.0) + 1.0;
                // PUT new price on one stock
                restdb.put(`/rest/nasdaq/${stockID}`,
                    {price: newprice}
                )
                .then((response) => {
                    
                    this.setState(previousState => {
                        return {lasttrade: response.data};
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        }, trade_delay);
    }
    
    render() {
        return (
        <div className="autotrade">
            <p>Trading: {this.state.lasttrade ? (this.state.lasttrade.symbol + ' at ' + this.state.lasttrade.price.toFixed(2)) : 'none'}</p>
        </div>
        );
  }
}


export default Trader;