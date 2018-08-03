const encodeCall = require('zos-lib/lib/helpers/encodeCall').default;
const Donations_v1 = artifacts.require('Donations_v1');
const MintableERC721Token = artifacts.require('MintableERC721Token');
const shouldBehaveLikeDonations_v1 = require('./Donations_v1.behavior.js');

contract('Donations_v1', ([_, owner, second]) => {
    const tokenName = 'Unicorn token';
    const tokenSymbol = 'UNI';

    beforeEach(async function() {

        this.donations = await Donations_v1.new();
        const donationsData = encodeCall('initialize', ['address'], [owner]);
        await this.donations.sendTransaction({ data: donationsData, from: owner });

        this.token = await MintableERC721Token.new();
        const data = encodeCall(
            'initialize',
            ['address', 'string', 'string'],
            [this.donations.address, tokenName, tokenSymbol]
        );
        await this.token.sendTransaction({ data, from: owner });
        await this.donations.setToken(this.token.address, { from: owner });
    });

    shouldBehaveLikeDonations_v1(owner, second, tokenName, tokenSymbol);
});