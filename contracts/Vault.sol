//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./StableCoinToken.sol";
import "./PriceConsumerV3.sol";

contract Vault is Ownable {
  StableCoinToken public s_token;
  PriceConsumerV3 private s_oracle;

  event depositEvent(uint256 depositAmount, uint256 amountToMint);
  event withdrawEvent(uint256 amountToWithdraw, uint256 repaymentAmount);

  constructor(
    PriceConsumerV3 _priceConsumerV3,
    StableCoinToken _stableCoinToken
  ) {
    s_token = _stableCoinToken;
    s_oracle = _priceConsumerV3;
  }

  struct VaultStruct {
    uint256 debtAmount;
    uint256 collateralAmount;
  }

  mapping(address => VaultStruct) public vaults;

  function deposit(uint256 _depositAmount) external payable {
    require(_depositAmount == msg.value, "incorrect ETH amount");
    uint256 amountToMint = _depositAmount * getEthUSDPrice();
    s_token.mint(msg.sender, amountToMint);
    vaults[msg.sender].collateralAmount += _depositAmount;
    vaults[msg.sender].debtAmount += amountToMint;
    emit depositEvent(_depositAmount, amountToMint);
  }

  function withdraw(uint256 _repaymentAmount) external payable {
    require(
      _repaymentAmount <= vaults[msg.sender].debtAmount,
      "withdraw limit exceeded"
    );
    require(
      s_token.balanceOf(msg.sender) >= _repaymentAmount,
      "not enough tokens in balance"
    );
    uint256 amountToWithdraw = _repaymentAmount / getEthUSDPrice();
    s_token.burn(msg.sender, _repaymentAmount);
    vaults[msg.sender].collateralAmount -= amountToWithdraw;
    vaults[msg.sender].debtAmount -= _repaymentAmount;
    payable(msg.sender).transfer(amountToWithdraw);
    emit withdrawEvent(amountToWithdraw, _repaymentAmount);
  }

  function getEthUSDPrice() public view returns (uint256) {
    uint256 price = uint256(s_oracle.getLatestPrice());
    return price;
  }

  function getVault(address userAddress)
    external
    view
    returns (VaultStruct memory)
  {
    return vaults[userAddress];
  }

  function estimateCollateralAmount(uint256 _repaymentAmount)
    external
    view
    returns (uint256 collateralAmount)
  {
    return _repaymentAmount / getEthUSDPrice();
  }

  function estimateTokenAmount(uint256 _depositAmount)
    external
    view
    returns (uint256 tokenAmount)
  {
    return _depositAmount * getEthUSDPrice();
  }
}
