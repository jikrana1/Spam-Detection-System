const express = require("express");
const router = express.Router();

const {
  getHistory,
  searchHistory,
  deleteHistoryItem,
  clearHistory,
  bulkDeleteHistory
} = require("../controllers/historyController");

const { protect } = require("../middleware/authMiddleware");

// Get logged-in user's history
router.get("/", protect, getHistory);

// Search user's history
router.get("/search", protect, searchHistory);

// Bulk delete history items
router.delete("/bulk-delete", protect, bulkDeleteHistory);

// Delete one history item
router.delete("/:id", protect, deleteHistoryItem);

// Clear all history
router.delete("/", protect, clearHistory);

module.exports = router;