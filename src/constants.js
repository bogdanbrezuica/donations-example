import * as config from '../truffle-config';

export const ACTIVE_NETWORK = config.networks.rinkeby;

const deployData = require(`../zos.${ACTIVE_NETWORK.name}.json`);

export const DONATIONS_ADDRESS = deployData.proxies.Donations[0].address;
export const TOKEN_ADDRESS = deployData.proxies.MintableERC721Token[0].address;
