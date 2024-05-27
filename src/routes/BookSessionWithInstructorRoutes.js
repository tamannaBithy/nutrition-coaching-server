const express = require("express");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { isAdminMiddleware } = require("../middlewares/IsAdminMiddleware");
const {
  createSessionController,
  updateSessionController,
  getAllSessionsController,
  getUserSessionsController,
} = require("../controllers/BookSessionWithInstructorControllers");

const router = express.Router();

// Create a new session
router.post("/create-session", authMiddleware, createSessionController);

// Update a session by ID
router.put(
  "/update-session/:id",
  authMiddleware,
  isAdminMiddleware,
  updateSessionController
);

// Get all sessions (for admin users)
router.get(
  "/get-sessions",
  authMiddleware,
  isAdminMiddleware,
  getAllSessionsController
);

// Get user's session
router.get("/get-userSession", authMiddleware, getUserSessionsController);

module.exports = router;
