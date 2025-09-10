import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";

const BidForm = () => {
	const { id } = useParams();
	const [auctionItem, setAuctionItem] = useState(null);
	const [bidAmount, setBidAmount] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchAuctionItem = async () => {
			try {
				const res = await api.get(`/api/auctions/${id}`);
				setAuctionItem(res.data);
				setBidAmount(res.data.startingBid || "");
			} catch (err) {
				setError("Failed to load auction item. Please try again.");
				console.error("Error fetching auction item:", err.response?.data?.message || err.message);
			}
		};

		fetchAuctionItem();
	}, [id]);

	const handleBid = async (e) => {
		e.preventDefault();
		try {
			await api.post(
				"/api/bids",
				{ auctionItemId: id, bidAmount }
			);
			navigate(`/auctions/${id}`);
		} catch (err) {
			if (err.response?.status === 401) {
				setError("You must be logged in to place a bid. Please log in and try again.");
			} else {
				setError(err.response?.data?.message || "Failed to place bid. Please try again.");
			}
			console.error("Error placing bid:", err.response?.data?.message || err.message);
		}
	};

	if (!auctionItem) return <div>Loading...</div>;

	return (
		<div className="max-w-lg p-6 mx-auto mt-12 bg-white rounded-lg shadow-md">
			<h2 className="mb-6 text-3xl font-extrabold text-gray-800">
				Place a Bid
			</h2>
			{error && <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-200 rounded-lg">{error}</div>}
			<div className="p-4 mb-6 bg-gray-100 border border-gray-200 rounded-lg">
				<p className="text-lg font-medium text-gray-700">
					Starting Bid Amount:
				</p>
				<p className="text-2xl font-bold text-gray-900">
					${auctionItem.startingBid.toFixed(2)}
				</p>
			</div>
			<form onSubmit={handleBid} className="space-y-4">
				<div>
					<label className="block mb-2 text-lg font-medium text-gray-700">
						Bid Amount
					</label>
					<input
						type="number"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
						value={bidAmount}
						onChange={(e) => setBidAmount(e.target.value)}
						min={auctionItem.startingBid}
						required
					/>
				</div>
				<button
					type="submit"
					className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				>
					Place Bid
				</button>
			</form>
		</div>
	);
};

export default BidForm;
