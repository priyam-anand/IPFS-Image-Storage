// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SimpleStorage {
    string public ipfsHash;

    function get()public view returns(string memory){
        return ipfsHash;
    }
    function set(string memory _ipfsHash)public {
        ipfsHash=_ipfsHash;
    }
}