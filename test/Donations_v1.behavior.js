const should = require('chai').should();
const { assertRevert } = require('./helpers/assertRevert');
const shouldBehaveLikeDonations_v0 = require('./Donations_v0.behavior');

module.exports = function(owner, second, tokenName, tokenSymbol) {
    shouldBehaveLikeDonations_v0(owner, second, tokenName, tokenSymbol);
    const amount = web3.toWei(1, 'ether');
    const donation = { value: amount, from: second };
    
    describe('donate', function() {
        describe('in the first stage', function() {
            beforeEach(async function() {
                await this.donations.donate(donation);                
            });

            it('increases donor balance for first stage', async function() {
                (await this.donations.getDonorBalanceByStage(second, 0))
                    .toNumber().should.be.eq(Number(amount));                
            });
        });

        describe('in the second stage', function() {
            beforeEach(async function() {
                await this.donations.withdraw(owner, { from: owner });
                await this.donations.donate(donation);                
            });

            it('increases donor\'s balance for second stage', async function() {
                (await this.donations.getDonorBalanceByStage(second, 1))
                    .toNumber().should.be.eq(Number(amount));                
            });
        });
    });

    describe('withdraw donations', function() {
        beforeEach(async function() {
            await this.donations.donate(donation);
        });

        describe('when amount is invalid', function() {
            it('should revert', async function() {
                const invalidAmount = web3.toWei(2, 'ether');
                await assertRevert(this.donations.withdrawDonation(invalidAmount, { from: second }));
                
                // enter a new stage; the donation can't be withdrawn anymore
                await this.donations.withdraw(owner, { from: owner });
                await assertRevert(this.donations.withdrawDonation(amount, { from: second }));                
            });
        });

        describe('when amount is valid', function() {
            it('decreases donor\'s total balance', async function() {
                await this.donations.withdrawDonation(amount, { from: second });
                (await this.donations.getDonorBalance(second)).toNumber().should.be.eq(0);
            });

            it('decreases donor\'s balance for the current stage', async function() {
                await this.donations.withdrawDonation(amount, { from: second });
                (await this.donations.getDonorBalanceByStage(second, 0)).toNumber().should.be.eq(0);
            });
        });
    });

    describe('withdraw entire balance', function() {
        it('increases stage number', async function() {
            await this.donations.withdraw(owner, { from: owner });
            (await this.donations.stage()).toNumber().should.be.eq(1);
        });

        it('sends entire balance', async function() {
            await this.donations.withdraw(owner, { from: owner });
            (await web3.eth.getBalance(this.donations.address)).toNumber().should.be.eq(0);            
        });
    });
}
