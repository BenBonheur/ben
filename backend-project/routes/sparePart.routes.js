const express = require('express');
const router = express.Router();
const sparePartController = require("../controllers/sparePart.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Create a new spare part
router.post("/", authMiddleware, sparePartController.create);

// Retrieve all spare parts
router.get("/", authMiddleware, sparePartController.findAll);

// Retrieve a single spare part with id
router.get("/:id", authMiddleware, sparePartController.findOne);

// Update a spare part with id
router.put("/:id", authMiddleware, sparePartController.update);

// Delete a spare part with id
router.delete("/:id", authMiddleware, sparePartController.delete);

module.exports = router; 