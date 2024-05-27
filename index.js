// Import required modules and files
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { hashPassword } = require("./src/utils/passwordUtils");
const User = require("./src/models/UserModel");

// Load environment variables from a .env file
dotenv.config();

// Import socket.io
const http = require("http");
const socketIo = require("socket.io");

// Function to connect to the MongoDB database
async function connectToDatabase() {
  try {
    // Connect to the MongoDB database using the provided URI
    await mongoose.connect(process.env.DB_CONNECTION_URI);

    // Log successful database connection
    console.log("Database connected successfully");
  } catch (err) {
    // Log MongoDB connection error
    console.error("MongoDB connection error", err);
  }
}

// Function to seed an admin user into the database
async function seedAdminUser() {
  try {
    // Check if an admin user already exists
    const adminUserExists = await User.exists({ role: "admin" });

    if (!adminUserExists) {
      // If no admin user exists, create a new admin user
      const adminUserData = {
        phone: "12345678",
        email: "admin@example.com",
        password: await hashPassword("adminPassword"), // Hashed password for "adminPassword"
        role: "admin",
      };

      // Create the admin user in the database
      const adminUser = await User.create(adminUserData);

      if (adminUser) {
        // Log success if admin user is created
        console.log("Admin user created successfully");
      } else {
        // Log error if admin user creation fails
        console.error("Error creating admin user");
      }
    } else {
      // Log if an admin user already exists
      console.log("Admin user already exists");
    }
  } catch (error) {
    // Log error if there is an issue with seeding the admin user
    console.error("Error seeding admin user", error.message);
  }
}

// Function to start the server
async function startServer() {
  // Define the port for the server to listen on
  const PORT = process.env.PORT || 8000;

  // Import the main application
  const app = require("./app");

  // Create HTTP server
  const server = http.createServer(app);

  // Initialize socket.io
  const io = socketIo(server, {
    pingTimeOut: 60000,
    cors: {
      origin: "*", // Allow requests from any origin (Need to change it at production mode)
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  // Use Socket.io middleware to handle WebSocket connections
  app.set("socketio", io);

  // Handle socket.io connections
  io.on("connection", (socket) => {
    console.log("Backend: New client connected");

    /*
     * Upon establishing connection:
     *  - Frontend transmits user data.
     *  - The user is assigned to a designated room based on their role.
     */
    socket.on("setup", (userData) => {
      // Creating a new room and joining the user to the room based on their role

      if (userData?.role === "admin") {
        socket.join("adminRoom");
      } else if (userData?.role === "user") {
        socket.join(`customerRoom_${userData?._id}`);
      }
    });
  });

  // Start the server and listen on the specified port
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Execute the following asynchronous tasks in sequence: connect to the database, seed the admin user, and start the server
(async () => {
  try {
    await connectToDatabase();
    await startServer();
    await seedAdminUser();
  } catch (error) {
    console.error("Error during startup", error);
  }
})();
