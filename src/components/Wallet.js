import React, { Component } from 'react';
import { Donations, Token } from '../contracts';
import { DONATIONS_ADDRESS, TOKEN_ADDRESS } from '../constants';

class Wallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            balance: null,
            donorBalance: null,
            numTokens: null,
            tokenIds: []
        }
        this.donations = Donations.at(DONATIONS_ADDRESS);
        this.token = Token.at(TOKEN_ADDRESS);
        this.account = props.web3.eth.accounts[0];
    }

    componentDidMount() {
        const { web3 } = this.props;
        if (!this.account) {
            return;
        }
        web3.eth.getBalance(this.account, (err, result) => {
            this.setState({ balance: web3.fromWei(result, 'ether').toString() })
        });
        this.donations.getDonorBalance(this.account).then((balance) => {
            this.setState({ donorBalance: web3.fromWei(balance).toString() });
        });
        this.token.balanceOf(this.account).then((result) => {
            const numTokens = result.toString();
            this.setState({ numTokens });
            if (numTokens) {
                this.getTokenIds(numTokens);
            }
        });
    }

    getTokenIds(numTokens) {
        const promises = [];
        for (let i = 0; i < Number(numTokens); i++) {
            promises.push(this.token.tokenOfOwnerByIndex(this.account, i));
        }
        Promise.all(promises).then((tokenIds) => {
            this.setState({ tokenIds: tokenIds.map(bigNumber => bigNumber.toString()) });
        });
    }

    onValueChange = (ev) => {
        this.setState({ value: ev.target.value });
    };

    render() {
        const { balance, donorBalance, numTokens, tokenIds } = this.state;
        const accountLocked = !this.account;

        if (accountLocked) {
            return (
              <div style={{ padding: '32px 64px', borderBottom: '1px solid black' }}>
                Unlock your account
              </div>              
            );
        }
        const tokens = tokenIds.map(tokenId =>
          <span key={tokenId} style={{ marginRight: '5px' }}>#{tokenId}</span>
        );
        return (
          <div style={{ padding: '32px 64px', borderBottom: '1px solid black' }}>
            <h2>Wallet</h2>
            <div>Address: {this.account}</div>
            <div>Balance: {balance} ETH</div>
            <div>Total donations: {donorBalance} ETH</div>
            <div>Unicorn tokens ({numTokens}): {tokens}</div>
          </div>
        );
    }
}

export default Wallet;