// import Web3 from 'web3';
import contract from 'truffle-contract';

const provider = typeof global.web3 !== 'undefined' && global.web3.currentProvider;

const Donations = contract(require('../build/contracts/Donations_v2.json'));
Donations.setProvider(provider);

const Token = contract(require('../build/contracts/MintableERC721Token.json'));
Token.setProvider(provider);

export {
  Donations,
  Token
}