const contract = artifacts.require("SimpleStorage")
module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(contract);
};
