const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		// Using mongoose connection options instead of deprecated setting
		const conn = await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 5000, // Timeout after 5s
			socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
			strictQuery: false // Set through options instead of global setting
		});
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error connecting to MongoDB: ${error.message}`);
		process.exit(1);
	}
};

module.exports = connectDB;
