const express = require('express');
const router = express.Router();
const stockInController = require("../controllers/stockIn.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Create a new stock in record
router.post("/", authMiddleware, stockInController.create);

// Retrieve all stock in records
router.get("/", authMiddleware, stockInController.findAll);

module.exports = router; 