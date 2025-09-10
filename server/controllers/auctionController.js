const AuctionItem = require("../models/AuctionItem");
const Bid = require("../models/Bid");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const createAuctionItem = async (req, res) => {
	const { title, description, startingBid, endDate } = req.body;
	const userId = req.user.id;

	try {
		// Input validation
		if (!title || !description || !startingBid || !endDate) {
			return res.status(400).json({ message: "All fields are required" });
		}

		if (startingBid <= 0) {
			return res.status(400).json({ message: "Starting bid must be greater than 0" });
		}

		const auctionEndDate = new Date(endDate);
		if (auctionEndDate <= new Date()) {
			return res.status(400).json({ message: "End date must be in the future" });
		}

		// Sanitize inputs
		const sanitizedTitle = title.trim();
		const sanitizedDescription = description.trim();

		const auctionItem = await AuctionItem.create({
			title: sanitizedTitle,
			description: sanitizedDescription,
			startingBid: Number(startingBid),
			endDate: auctionEndDate,
			createdBy: userId,
		});

		res.status(201).json(auctionItem);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAuctionItems = async (req, res) => {
	try {
		const auctionItems = await AuctionItem.find();
		res.status(200).json(auctionItems);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAuctionItemById = async (req, res) => {
	const { id } = req.params;
	try {
		const auctionItem = await AuctionItem.findById(id);
		if (!auctionItem) {
			return res.status(404).json({ message: "Auction item not found" });
		}
		res.status(200).json(auctionItem);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAuctionItemsByUser = async (req, res) => {
	try {
		// The user is already attached to the request by the authMiddleware
		const userId = req.user.id;
		
		const auctionItems = await AuctionItem.find({ createdBy: userId });
		res.status(200).json({
			auctionItems,
		});
	} catch (error) {
		console.log("Error in getAuctionItemsByUser:", error.message);
		res.status(500).json({ message: error.message });
	}
};

const updateAuctionItem = async (req, res) => {
	const { id } = req.params;
	const { title, description, startingBid, endDate } = req.body;
	const userId = req.user.id;

	try {
		const auctionItem = await AuctionItem.findById(id);

		if (!auctionItem) {
			return res.status(404).json({ message: "Auction item not found" });
		}

		if (auctionItem.createdBy.toString() !== userId) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		auctionItem.title = title || auctionItem.title;
		auctionItem.description = description || auctionItem.description;
		auctionItem.startingBid = startingBid || auctionItem.startingBid;
		auctionItem.endDate = endDate
			? new Date(new Date(endDate).getTime())
			: auctionItem.endDate;
		auctionItem.updatedAt = new Date(new Date().getTime());
		await auctionItem.save();

		res.json(auctionItem);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteAuctionItem = async (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;

	try {
		const auctionItem = await AuctionItem.findById(id);

		if (!auctionItem) {
			return res.status(404).json({ message: "Auction item not found" });
		}

		if (auctionItem.createdBy.toString() !== userId) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		const bids = await Bid.find({ auctionItemId: id });
		for (const bid of bids) {
			await bid.remove();
		}

		await auctionItem.remove();

		res.json({ message: "Auction item removed" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAuctionWinner = async (req, res) => {
	const { id } = req.params;
	try {
		const auctionItem = await AuctionItem.findById(id);
		if (!auctionItem) {
			return res
				.status(404)
				.json({ winner: "", message: "Auction item not found" });
		}

		if (new Date(auctionItem.endDate) > new Date(Date.now())) {
			return res
				.status(400)
				.json({ winner: "", message: "Auction has not ended yet" });
		}

		const bids = await Bid.find({ auctionItemId: id });
		if (bids.length === 0) {
			return res
				.status(200)
				.json({ winner: "", message: "No bids found" });
		}

		let highestBid = bids.reduce(
			(max, bid) => (bid.bidAmount > max.bidAmount ? bid : max),
			bids[0]
		);

		const winner = await User.findById(highestBid.userId);
		if (!winner) {
			return res
				.status(404)
				.json({ winner: "", message: "Winner not found" });
		}

		res.status(200).json({ winner });
	} catch (error) {
		console.error("Error fetching auction winner:", error);
		res.status(500).json({ message: error.message });
	}
};

const getAuctionsWonByUser = async (req, res) => {
	try {
		// The user is already attached to the request by the authMiddleware
		const userId = req.user.id;

		const bidsByUser = await Bid.find({ userId });
		const auctionIds = bidsByUser.map((bid) => bid.auctionItemId);

		const uniqueAuctionIds = [...new Set(auctionIds)];

		let wonAuctions = [];

		for (let i = 0; i < uniqueAuctionIds.length; i++) {
			const auctionItemId = uniqueAuctionIds[i];
			const bids = await Bid.find({ auctionItemId });
			
			// Check if bids array is empty
			if (!bids || bids.length === 0) {
				continue;
			}
			
			let winningBid = bids.reduce(
				(max, bid) => (bid.bidAmount > max.bidAmount ? bid : max),
				bids[0]
			);

			const auctionItem = await AuctionItem.findById(auctionItemId);
			
			// Check if auction item exists
			if (!auctionItem) {
				continue;
			}
			
			const isAuctionEnded =
				new Date(auctionItem.endDate) <= new Date(Date.now());

			if (isAuctionEnded && winningBid.userId.toString() === userId) {
				wonAuctions.push({
					auctionId: auctionItemId,
					title: auctionItem.title,
					description: auctionItem.description,
					winningBid: winningBid.bidAmount,
					endDate: auctionItem.endDate,
				});
			}
		}
		res.status(200).json({ wonAuctions });
	} catch (error) {
		console.log("Error in getAuctionsWonByUser:", error.message);
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	createAuctionItem,
	getAuctionItems,
	updateAuctionItem,
	deleteAuctionItem,
	getAuctionItemById,
	getAuctionItemsByUser,
	getAuctionWinner,
	getAuctionsWonByUser,
};
