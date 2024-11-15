// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EnhancedChatDApp is ReentrancyGuard {
    using Counters for Counters.Counter;

    enum MessageType { Text, File, Image, Payment }

    struct Message {
        uint256 id;
        address sender;
        MessageType messageType;
        string content;
        uint256 timestamp;
        uint256 amount;
    }

    mapping(address => Message[]) private messages;
    Counters.Counter private messageIdCounter;

    event MessageSent(
        uint256 indexed messageId,
        address indexed from,
        address indexed to,
        MessageType messageType,
        string content,
        uint256 timestamp,
        uint256 amount
    );

    modifier validAddress(address _address) {
        require(_address != address(0), "Invalid address");
        _;
    }

    function sendMessage(address _to, string memory _content, MessageType _type) public payable nonReentrant validAddress(_to) {
        require(bytes(_content).length > 0, "Content cannot be empty");
        require(_type != MessageType.Payment || msg.value > 0, "Payment requires ETH");

        uint256 amount = (_type == MessageType.Payment) ? msg.value : 0;

        if (_type == MessageType.Payment) {
            (bool success, ) = payable(_to).call{value: msg.value}("");
            require(success, "Payment failed");
        }

        uint256 messageId = messageIdCounter.current();
        messageIdCounter.increment();

        messages[_to].push(Message(messageId, msg.sender, _type, _content, block.timestamp, amount));

        emit MessageSent(messageId, msg.sender, _to, _type, _content, block.timestamp, amount);
    }

    function getMessages() public view returns (Message[] memory) {
        return messages[msg.sender];
    }

    function getMessageCount() public view returns (uint256) {
        return messages[msg.sender].length;
    }

    receive() external payable {
        revert("Use sendMessage function to send ETH");
    }

    fallback() external payable {
        revert("Function does not exist");
    }
}