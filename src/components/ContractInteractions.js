import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Donations } from '../contracts';
import { DONATIONS_ADDRESS } from '../constants';
import { OwnerInteractions } from './';

class ContractInteractions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            balance: null,
            donationValue: 0,
            owner: '',
            stageBalance: 0,
            withdrawValue: 0,
        };
        this.donations = Donations.at(DONATIONS_ADDRESS);
        this.account = props.web3.eth.accounts[0];
    }

    componentDidMount() {
        const { web3 } = this.props;
        web3.eth.getBalance(this.donations.address, (err, result) => {
            this.setState({ balance: web3.fromWei(result).toString() })
        });
        if (this.account) {
            this.donations.stage().then(stage => {
                this.donations.getDonorBalanceByStage(this.account, stage)
                    .then(balance => {
                        this.setState({ stageBalance: web3.fromWei(balance).toString() })
                    });
            });
        }
        this.donations.owner().then(owner => this.setState({ owner }));
    }

    onValueChange = (ev) => {
        this.setState({ donationValue: ev.target.value });
    };

    onWithdrawChange = (ev) => {
        this.setState({ withdrawValue: ev.target.value });
    };

    onDonate = () => {
        const { web3 } = this.props;
        const { donationValue } = this.state;
        const wei = web3.toWei(donationValue, 'ether');
        this.donations.donate.sendTransaction({ from: this.account, value: wei }).then(tx => {
            console.log('pending tx', tx);
        });
    };

    onWithdraw = () => {
        const { web3 } = this.props;
        const { withdrawValue } = this.state;
        const wei = web3.toWei(withdrawValue, 'ether');
        this.donations.withdrawDonation.sendTransaction(wei, { from: this.account }).then(tx => {
            console.log('pending tx', tx);
        });
    }

    render() {
        const { balance, donationValue, owner, stageBalance, withdrawValue } = this.state;
        const { web3 } = this.props;
        const disabled = !this.account;

        return (
          <div style={{ padding: '32px 64px' }}>
            <h2>Contract information</h2>
            <div>Balance: {balance} ETH</div>
            <div>Owner: {owner}</div>
            <div style={{ display: 'flex', height: '44px', marginTop: '24px' }}>
              <TextField
                label="Donate (ETH)"
                onChange={this.onValueChange}
                value={donationValue}
              />
              <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Button
                  disabled={disabled}
                  onClick={this.onDonate}
                  size="small"
                  style={{ marginLeft: '24px' }}
                  variant="outlined"
                >
                  Donate
                </Button>
              </div>
            </div>
            <div style={{ display: 'flex', height: '64px', marginTop: '24px' }}>
              <TextField
                helperText={`max. ${stageBalance} ETH`}
                label="Withdraw (ETH)"
                onChange={this.onWithdrawChange}
                value={withdrawValue}
              />
              <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Button
                  disabled={disabled}
                  onClick={this.onWithdraw}
                  size="small"
                  style={{ marginLeft: '24px' }}
                  variant="outlined"
                >
                  Withdraw donation
                </Button>
              </div>
            </div>
            {owner && this.account === owner && <OwnerInteractions balance={balance} web3={web3} />}
          </div>
        );
    }
}

export default ContractInteractions;