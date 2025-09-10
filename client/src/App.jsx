import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuctionList from "./components/AuctionList";
import AuctionItem from "./components/AuctionItem";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import BidForm from "./components/BidForm";
import Logout from "./components/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/index";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import CreateAuctionItem from "./components/CreateAuctionItem";
import EditAuctionItem from "./components/EditAuctionItem";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const login = () => {
		console.log("Setting isLoggedIn to true");
		setIsLoggedIn(true);
		// Trigger storage event to notify other tabs
		localStorage.setItem('auth-state', Date.now().toString());
	};

	const logout = () => {
		setIsLoggedIn(false);
	};

	const getTokenFromCookie = () => {
		const cookies = document.cookie.split('; ');
		const tokenCookie = cookies.find(row => row.startsWith('jwt='));
		return tokenCookie ? tokenCookie.split('=')[1] : null;
	};
	
	useEffect(() => {
		const checkAuth = () => {
		const token = getTokenFromCookie();
		console.log("Auth check - token exists:", !!token);
		if (token) {
			login();
		} else {
			logout();
		}
		};
		
		checkAuth();
		
		// Check auth again whenever storage event is triggered
		const handleStorageEvent = (e) => {
			if (e.key === 'auth-state') {
				checkAuth();
			}
		};
		
		window.addEventListener('storage', handleStorageEvent);
		return () => window.removeEventListener('storage', handleStorageEvent);
	}, []);

	return (
		<AuthProvider value={{ isLoggedIn, login, logout }}>
			<Router>
				<NavBar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/auctions" element={<AuctionList />} />
					<Route path="/auctions/:id" element={<AuctionItem />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/login" element={<Login />} />
					<Route 
						path="/profile" 
						element={<ProtectedRoute component={Profile} />} 
					/>
					<Route
						path="/auctions/create"
						element={<ProtectedRoute component={CreateAuctionItem} />}
					/>
					<Route
						path="/auctions/:id/edit"
						element={<ProtectedRoute component={EditAuctionItem} />}
					/>
					<Route
						path="/auctions/:id/bid"
						element={<ProtectedRoute component={BidForm} />}
					/>
					<Route path="/logout" element={<Logout />} />
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
