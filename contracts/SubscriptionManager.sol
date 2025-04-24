// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SubscriptionManager is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    struct Subscription {
        uint256 id;
        uint256 creatorId;
        uint256 tierId;
        address subscriber;
        uint256 startTime;
        uint256 endTime;
        uint256 amountPaid;
        bool isActive;
        uint256 createdAt;
    }

    Counters.Counter private _subscriptionIds;
    mapping(uint256 => Subscription) public subscriptions;
    mapping(address => mapping(uint256 => uint256)) public activeSubscriptionByCreator; // subscriber => creatorId => subscriptionId
    mapping(uint256 => uint256) public totalSubscriptionsByCreator; // creatorId => count

    event SubscriptionCreated(
        uint256 indexed subscriptionId,
        uint256 indexed creatorId,
        uint256 indexed tierId,
        address subscriber,
        uint256 amountPaid,
        uint256 startTime,
        uint256 endTime
    );

    event SubscriptionCancelled(uint256 indexed subscriptionId);
    event SubscriptionExtended(uint256 indexed subscriptionId, uint256 newEndTime);

    constructor() Ownable(msg.sender) {}

    function subscribe(
        uint256 creatorId,
        uint256 tierId,
        uint256 months,
        uint256 amount
    ) external payable nonReentrant returns (uint256) {
        require(msg.value == amount, "Incorrect payment amount");
        require(months > 0, "Invalid subscription period");

        // Cancel any existing subscription for this creator
        uint256 existingSubscriptionId = activeSubscriptionByCreator[msg.sender][creatorId];
        if (existingSubscriptionId != 0) {
            subscriptions[existingSubscriptionId].isActive = false;
        }

        _subscriptionIds.increment();
        uint256 newSubscriptionId = _subscriptionIds.current();

        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + (months * 30 days);

        subscriptions[newSubscriptionId] = Subscription({
            id: newSubscriptionId,
            creatorId: creatorId,
            tierId: tierId,
            subscriber: msg.sender,
            startTime: startTime,
            endTime: endTime,
            amountPaid: amount,
            isActive: true,
            createdAt: block.timestamp
        });

        activeSubscriptionByCreator[msg.sender][creatorId] = newSubscriptionId;
        totalSubscriptionsByCreator[creatorId]++;

        emit SubscriptionCreated(
            newSubscriptionId,
            creatorId,
            tierId,
            msg.sender,
            amount,
            startTime,
            endTime
        );

        return newSubscriptionId;
    }

    function cancelSubscription(uint256 subscriptionId) external {
        Subscription storage subscription = subscriptions[subscriptionId];
        require(subscription.subscriber == msg.sender, "Not the subscriber");
        require(subscription.isActive, "Subscription not active");

        subscription.isActive = false;
        activeSubscriptionByCreator[msg.sender][subscription.creatorId] = 0;

        emit SubscriptionCancelled(subscriptionId);
    }

    function extendSubscription(
        uint256 subscriptionId,
        uint256 additionalMonths,
        uint256 amount
    ) external payable nonReentrant {
        require(msg.value == amount, "Incorrect payment amount");
        require(additionalMonths > 0, "Invalid extension period");

        Subscription storage subscription = subscriptions[subscriptionId];
        require(subscription.subscriber == msg.sender, "Not the subscriber");
        require(subscription.isActive, "Subscription not active");

        subscription.endTime += (additionalMonths * 30 days);
        subscription.amountPaid += amount;

        emit SubscriptionExtended(subscriptionId, subscription.endTime);
    }

    function getSubscription(uint256 subscriptionId) external view returns (Subscription memory) {
        return subscriptions[subscriptionId];
    }

    function getActiveSubscription(address subscriber, uint256 creatorId) external view returns (Subscription memory) {
        uint256 subscriptionId = activeSubscriptionByCreator[subscriber][creatorId];
        return subscriptions[subscriptionId];
    }

    function withdrawFunds(address payable creator, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        creator.transfer(amount);
    }
} 