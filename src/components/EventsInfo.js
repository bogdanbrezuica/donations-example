import React, { Component } from 'react';
import { Donations } from '../contracts';
import { DONATIONS_ADDRESS } from '../constants';

class EventsInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            donations: [],
            donorWithdrawals: [],
            withdrawals: [],
        };
        this.donations = Donations.at(DONATIONS_ADDRESS);
    }

    componentDidMount() {
        const newDonation = this.donations.NewDonation({}, { fromBlock: 0, toBlock: 'latest' });
        const balanceWithdrawn = this.donations.BalanceWithdrawn({}, { fromBlock: 0, toBlock: 'latest' });
        const donationWithdrawn = this.donations.DonationWithdrawn({}, { fromBlock: 0, toBlock: 'latest' });
        
        newDonation.watch((err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            this.setState({ donations: [...this.state.donations, result] });
        });
        balanceWithdrawn.watch((err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            this.setState({ withdrawals: [...this.state.withdrawals, result] });
        });
        donationWithdrawn.watch((err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            this.setState({ donorWithdrawals: [...this.state.donorWithdrawals, result] });
        });
    }

    renderDonationEvent = (event) => {
        const { web3 } = this.props;
        return (
          <tr key={event.transactionHash}>
            <td>{event.blockNumber}</td>
            <td>{event.args.donor}</td>
            <td>{(web3.fromWei(event.args.value)).toString()} ETH</td>
          </tr>
        );
    };

    renderWithdrawalEvent = (event) => {
        const { web3 } = this.props;
        return (
          <tr key={event.transactionHash}>
            <td>{event.blockNumber}</td>
            <td>{event.args.target}</td>
            <td>{event.args.endedStage.toString()}</td>
            <td>{(web3.fromWei(event.args.amount)).toString()} ETH</td>
          </tr>
        );
    };

    renderDonorWithdrawalEvent = (event) => {
        const { web3 } = this.props;
        return (
          <tr key={event.transactionHash}>
            <td>{event.blockNumber}</td>
            <td>{event.args.donor}</td>
            <td>{(web3.fromWei(event.args.amount)).toString()} ETH</td>
          </tr>
        );
    };

    renderTable = (title, headers, data, renderFn) => {
        return (
          <div>
            <h4>{title}</h4>
            <table>
              <thead>
                <tr>
                  {headers.map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.map(renderFn)}
              </tbody>
            </table>
          </div>
        );
    }

    render() {
        const { donations, donorWithdrawals, withdrawals } = this.state;

        return (
          <div style={{ padding: '32px 64px' }}>
            <h2>Events info</h2>
            {this.renderTable(
                'All donations',
                ['Block', 'Donor', 'Value'],
                donations,
                this.renderDonationEvent
            )}
            {this.renderTable(
                'Owner withdrawals',
                ['Block', 'Target address', 'Stage', 'Value'],
                withdrawals,
                this.renderWithdrawalEvent
            )}
            {this.renderTable(
                'Donor withdrawals',
                ['Block', 'Donor', 'Value'],
                donorWithdrawals,
                this.renderDonorWithdrawalEvent
            )}
          </div>
        );
    }
}

export default EventsInfo;