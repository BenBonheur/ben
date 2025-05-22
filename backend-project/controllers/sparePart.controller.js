const db = require("../models");
const SparePart = db.sparePart;

// Create a new spare part
exports.create = async (req, res) => {
  try {
    const sparePart = await SparePart.create({
      name: req.body.name,
      category: req.body.category,
      quantity: req.body.quantity,
      unitPrice: req.body.unitPrice,
      totalPrice: req.body.quantity * req.body.unitPrice
    });
    res.send(sparePart);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error occurred while creating spare part."
    });
  }
};

// Get all spare parts
exports.findAll = async (req, res) => {
  try {
    const spareParts = await SparePart.findAll();
    res.send(spareParts);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error occurred while retrieving spare parts."
    });
  }
};

// Find a single spare part
exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const sparePart = await SparePart.findByPk(id);
    if (sparePart) {
      res.send(sparePart);
    } else {
      res.status(404).send({
        message: `Spare part with id=${id} not found.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving spare part with id=" + id
    });
  }
};

// Update a spare part
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const num = await SparePart.update(req.body, {
      where: { id: id }
    });
    if (num == 1) {
      res.send({
        message: "Spare part was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update spare part with id=${id}. Maybe spare part was not found or req.body is empty!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error updating spare part with id=" + id
    });
  }
};

// Delete a spare part
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const num = await SparePart.destroy({
      where: { id: id }
    });
    if (num == 1) {
      res.send({
        message: "Spare part was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete spare part with id=${id}. Maybe spare part was not found!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete spare part with id=" + id
    });
  }
}; 