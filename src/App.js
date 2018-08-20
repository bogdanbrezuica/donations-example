import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ContractInteractions, EventsInfo, Wallet } from './components';
import { Donations, Token } from './contracts';
import { DONATIONS_ADDRESS, TOKEN_ADDRESS } from './constants';
import getWeb3 from './utils/getWeb3';
import './App.css';

class App extends Component {
  state = {
    balance: null,
    donations: null,
    token: null,
    web3: null,
  };

  componentDidMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    // Copied from https://github.com/truffle-box/react-box
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });
        
        // Instantiate contracts once web3 provided.
        this.instantiateContracts()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  instantiateContracts() {
    const donations = Donations.at(DONATIONS_ADDRESS);
    const token = Token.at(TOKEN_ADDRESS);
    this.setState({ donations, token });
    this.state.web3.eth.getBalance(donations.address, (err, result) => {
      this.setState({ balance: this.state.web3.fromWei(result, 'ether').toString() })
    });
  }

  render() {
    if (!this.state.web3) {
      return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size={50} />
        </div>
      );
    }

    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', width: '100%', padding: '0px 40px', maxWidth: '1200px' }}>
          <div style={{ width: '50%', borderRight: '2px solid black' }}>
            <ContractInteractions web3={this.state.web3} />
          </div>
          <div style={{ width: '50%' }}>
            <Wallet web3={this.state.web3} />
            <EventsInfo web3={this.state.web3} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
