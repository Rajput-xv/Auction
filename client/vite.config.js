import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// const target = "https://auction-system-server.onrender.com/api"; //  backend server URL
const target = "http://localhost:5000/api"; //  backend server URL

export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": {
				target,
				changeOrigin: true,
				secure: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});
