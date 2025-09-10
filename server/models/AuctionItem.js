const mongoose = require("mongoose");

const auctionItemSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	startingBid: {
		type: Number,
		required: true,
	},
	endDate: {
		type: Date,
		required: true,
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("AuctionItem", auctionItemSchema);
