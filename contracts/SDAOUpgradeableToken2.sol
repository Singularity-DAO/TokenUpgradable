// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <=0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract SDAOUpgradeableToken2 is Initializable, OwnableUpgradeable, ERC20Upgradeable {
    
    bool v2upgrade;

    function initialize(string memory name, string memory symbol, uint256 initialSupply) public virtual initializer {
        __ERC20_init(name, symbol);
        __Ownable_init();
        _mint(_msgSender(), initialSupply);
    }

    function additionalMint(uint256 newSupply) public onlyOwner {

     	require (!v2upgrade,"already upgraded");
        _mint(_msgSender(), newSupply);
        v2upgrade = true;
    }

}