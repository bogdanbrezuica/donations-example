const { assertRevert } = require('./helpers/assertRevert');
const should = require('chai').should();

module.exports = function(owner, second, tokenName, tokenSymbol) {
    describe('initialization', function() {
        it('has the correct owner', async function() {
            (await this.donations.owner()).should.be.eq(owner);
        });
    });

    describe('EC721 token', function() {
        it('has correct name', async function() {
            (await this.token.name()).should.be.eq(tokenName);
        });

        it('has correct symbol', async function() {
            (await this.token.symbol()).should.be.eq(tokenSymbol);
        });

        it('has correct owner', async function() {
            (await this.token.owner()).should.be.eq(this.donations.address);
        });

        it('cannot be set again', async function() {
            await assertRevert(this.donations.setToken(this.token.address, { from: owner }));
        });

        it('is set correctly in Donations contract', async function() {
            (await this.donations.token()).should.be.eq(this.token.address);
        });
    });

    describe('donate', function() {
        describe('when msg.value is 0', function() {
            it('should revert', async function() {
                await assertRevert(this.donations.donate({ value: 0, from: second }));
            });
        });

        describe('when msg.value is not 0', function() {
            beforeEach(async function() {
                this.amount = web3.toWei(1, 'ether');
                this.donation = { value: this.amount, from: second };
            
                await this.donations.donate(this.donation);                
            });
            
            it('increases donor balance', async function() {
                (await this.donations.getDonorBalance(second)).toNumber().should.be.eq(Number(this.amount));
            });
            
            it('mints a new token to the donor', async function() {
                (await this.token.ownerOf(0)).should.be.eq(second);
                (await this.token.balanceOf(second)).toNumber().should.be.eq(1);
            });

            it('increases numTokensMinted by one', async function() {
                (await this.donations.numTokensMinted()).toNumber().should.be.eq(1);
            });
        });
    });
}
