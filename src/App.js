import React, { Component } from 'react';
import { Donations_v2, MintableERC721Token } from '../contracts';
import { DONATIONS_ADDRESS, TOKEN_ADDRESS } from './constants';
import logo from './logo.svg';
import getWeb3 from './utils/getWeb3';
import './App.css';

class App extends Component {
  state = {
    donations: null,
    token: null,
    web3: null,
  };

  componentWillMount() {
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
    const donations = Donations_v2.at(DONATIONS_ADDRESS);
    const token = MintableERC721Token.at(TOKEN_ADDRESS);
    this.setState({ donations, token });
    // donations.
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          Donated so far: {}
          
          First account: {this.state.web3 && this.state.web3.eth.accounts[0]}
        </p>
      </div>
    );
  }
}

export default App;
