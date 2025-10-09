// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/CardFactory.sol";
import "../contracts/Duel.sol";

contract DeployAll is Script {
    function run() external {
        vm.startBroadcast();

        CardFactory factory = new CardFactory();
        Duel duel = new Duel(address(factory));

        console.log("CardFactory deployed at:", address(factory));
        console.log("Duel deployed at:", address(duel));

        vm.stopBroadcast();
    }
}
