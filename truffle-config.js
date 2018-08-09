'use strict';

module.exports = {
  networks: {
    local: {
      host: 'localhost',
      port: 9545,
      gas: 5000000,
      network_id: '*'
    },
    rinkeby: {
      name: 'rinkeby',
      host: 'localhost',
      port: '8545',
      gas: 5000000,
      network_id: 4
    }
  }
};