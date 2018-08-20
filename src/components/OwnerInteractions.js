import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Donations } from '../contracts';
import { DONATIONS_ADDRESS } from '../constants';

class OwnerInteractions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newOwner: '',
            targetAddress: '',
        };
        this.donations = Donations.at(DONATIONS_ADDRESS);
        this.account = props.web3.eth.accounts[0];
    }

    onNewOwnerChange = (ev) => {
        this.setState({ newOwner: ev.target.value });
    };

    onTargetChange = (ev) => {
        this.setState({ targetAddress: ev.target.value });
    };

    onChangeOwner = () => {
        const { newOwner } = this.state;
        this.donations.transferOwnership.sendTransaction(newOwner, { from: this.account }).then(tx => {
            console.log('pending tx', tx);
        });
    };

    onWithdraw = () => {
        const { targetAddress } = this.state;
        this.donations.withdraw.sendTransaction(targetAddress, { from: this.account }).then(tx => {
            console.log('pending tx', tx);
        });
    };

    render() {
        const { newOwner, targetAddress } = this.state;

        return (
          <React.Fragment>
            <div style={{ display: 'flex', height: '44px', marginTop: '24px' }}>
              <TextField
                label="Owner"
                onChange={this.onNewOwnerChange}
                value={newOwner}
              />
              <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Button
                  onClick={this.onChangeOwner}
                  size="small"
                  style={{ marginLeft: '24px' }}
                  variant="outlined"
                >
                  Change owner
                </Button>
              </div>
            </div>
            <div style={{ display: 'flex', height: '44px', marginTop: '24px' }}>
              <TextField
                label="Target address"
                onChange={this.onTargetChange}
                value={targetAddress}
              />
              <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Button
                  onClick={this.onWithdraw}
                  size="small"
                  style={{ marginLeft: '24px' }}
                  variant="outlined"
                >
                  Withdraw
                </Button>
              </div>
            </div>
          </React.Fragment>
        );
    }
}

export default OwnerInteractions;