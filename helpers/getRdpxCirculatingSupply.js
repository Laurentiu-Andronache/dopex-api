const { ERC20, Addresses } = require("@dopex-io/sdk");
const { BigNumber } = require("bignumber.js");
const Web3 = require("web3");

module.exports = async () => {
  const infuraProjectId = process.env.INFURA_PROJECT_ID;
  const web3 = new Web3(`https://mainnet.infura.io/v3/${infuraProjectId}`);

  const tokenSaleEmitted = 60000;

  const rdpx = new ERC20(web3, Addresses.mainnet.RDPX);

  const rdpxBalanceOf = rdpx.contract.methods.balanceOf;

  // Async call of all promises
  const [
    dpxFarmBalance,
    dpxWethFarmBalance,
    rdpxWethFarmBalance,
    rdpxMerkleDistributorBalance,
  ] = await Promise.all([
    rdpxBalanceOf(Addresses.mainnet.DPXStakingRewards).call(),
    rdpxBalanceOf(Addresses.mainnet["DPX-WETHStakingRewards"]).call(),
    rdpxBalanceOf(Addresses.mainnet["RDPX-WETHStakingRewards"]).call(),
    rdpxBalanceOf("0x20E3D49241A9658C36Df595437160a6F6Dc01bDe").call(),
  ]);

  // Farming (Total Rewards - Current Rewards)
  const dpxFarmEmitted =
    400000 - new BigNumber(dpxFarmBalance).dividedBy(1e18).toNumber();
  const dpxWethFarmEmitted =
    800000 - new BigNumber(dpxWethFarmBalance).dividedBy(1e18).toNumber();
  const rdpxWethFarmEmitted =
    800000 - new BigNumber(rdpxWethFarmBalance).dividedBy(1e18).toNumber();

  // For bootstrapping liquidity
  const sideEmitted = 20200;

  const airdropEmitted =
    83920 -
    new BigNumber(rdpxMerkleDistributorBalance).dividedBy(1e18).toNumber();

  const circulatingSupply =
    tokenSaleEmitted +
    dpxFarmEmitted +
    dpxWethFarmEmitted +
    rdpxWethFarmEmitted +
    sideEmitted +
    airdropEmitted;

  return circulatingSupply;
};
