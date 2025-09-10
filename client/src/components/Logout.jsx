import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import { useAuth } from "../contexts/AuthContext";

function Logout() {
	const navigate = useNavigate();
	const { logout: signout } = useAuth();
	const [error, setError] = useState("");

	useEffect(() => {
		const logout = async () => {
			try {
				await api.post("/api/users/logout", {});
				document.cookie =
					"jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
				signout();
				navigate("/login");
			} catch (err) {
				setError("Failed to log out. Please try again.");
				console.error("Logout error:", err.response?.data?.message || err.message);
				// Redirect to login after a delay even if there was an error
				setTimeout(() => {
					signout();
					navigate("/login");
				}, 3000);
			}
		};

		logout();
	}, [navigate, signout]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
			<div className="w-16 h-16 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin mb-4"></div>
			<h1 className="text-2xl font-bold mb-2">Logging out...</h1>
			{error && <p className="text-red-500">{error}</p>}
		</div>
	);
}

export default Logout;
