# Auction Platform

A full-stack auction application where users can create, bid on, and manage auction items in real-time.

## Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Auction Management**: Create, edit, and delete auction items
- **Real-time Bidding**: Place bids on active auctions
- **User Dashboard**: Profile management and auction history
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

**Frontend:**
- React 18 + Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls

**Backend:**
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Auction
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   
   Create `.env` file in server directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   Server runs on `http://localhost:5000`

2. **Start Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.