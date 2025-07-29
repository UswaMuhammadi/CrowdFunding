// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract crowdfundingg {
    struct Campaign {
        address payable creator;
        string title;
        uint goal;
        uint raised;
        bool completed;
    }

    Campaign[] public campaigns;

    event CampaignCreated(uint indexed campaignId, address creator, uint goal);
    event DonationReceived(uint indexed campaignId, address donor, uint amount);
    event CampaignCompleted(uint indexed campaignId, uint totalRaised);

    function createCampaign(string memory _title, uint _goal) public {
        require(_goal > 0, "Goal must be greater than zero");

        campaigns.push(Campaign({
            creator: payable(msg.sender),
            title: _title,
            goal: _goal,
            raised: 0,
            completed: false
        }));

        emit CampaignCreated(campaigns.length - 1, msg.sender, _goal);
    }

    function donate(uint _id) public payable {
        require(_id < campaigns.length, "Invalid campaign ID");
        Campaign storage c = campaigns[_id];
        require(!c.completed, "Campaign already completed");
        require(msg.value > 0, "Donation must be greater than zero");

        c.raised += msg.value;

        emit DonationReceived(_id, msg.sender, msg.value);

        if (c.raised >= c.goal) {
            c.completed = true;
            c.creator.transfer(c.raised);
            emit CampaignCompleted(_id, c.raised);
        }
    }

    function getCampaign(uint _id) public view returns (address, string memory, uint, uint, bool) {
        require(_id < campaigns.length, "Invalid campaign ID");
        Campaign memory c = campaigns[_id];
        return (c.creator, c.title, c.goal, c.raised, c.completed);
    }
}