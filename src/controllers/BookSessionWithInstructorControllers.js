const {
  createSessionService,
  updateSessionService,
  getAllSessionService,
  getUserSessionService,
} = require("../services/BookSessionWithInstructorServices");

// Controller function to create a new session
exports.createSessionController = async (req, res) => {
  const io = req.app.get("socketio"); // Access Socket.io instance from Express app
  const result = await createSessionService(req.user._id, req.body, io);
  return res.status(201).send(result);
};

// Controller function to update an existing session
exports.updateSessionController = async (req, res) => {
  const io = req.app.get("socketio"); // Access Socket.io instance from Express app

  const result = await updateSessionService(req.params.id, req.body, io);
  return res.status(200).send(result);
};

// Controller function to get all sessions
exports.getAllSessionsController = async (req, res) => {
  const result = await getAllSessionService();
  return res.status(200).send(result);
};

// Controller function to get sessions for a specific user
exports.getUserSessionsController = async (req, res) => {
  const result = await getUserSessionService(req.user._id);
  return res.status(200).send(result);
};
