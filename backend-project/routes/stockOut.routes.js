const express = require('express');
const router = express.Router();
const stockOutController = require("../controllers/stockOut.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Create a new stock out record
router.post("/", authMiddleware, stockOutController.create);

// Retrieve all stock out records
router.get("/", authMiddleware, stockOutController.findAll);

// Get daily stock out report
router.get("/daily-report", authMiddleware, stockOutController.getDailyReport);

module.exports = router; 