const db = require("../models");
const StockIn = db.stockIn;
const SparePart = db.sparePart;

// Create a new stock in record
exports.create = async (req, res) => {
  try {
    const sparePart = await SparePart.findByPk(req.body.sparePartId);
    if (!sparePart) {
      return res.status(404).send({
        message: "Spare part not found!"
      });
    }

    const stockIn = await StockIn.create({
      stockInQuantity: req.body.stockInQuantity,
      sparePartId: req.body.sparePartId
    });

    // Update spare part quantity
    await sparePart.update({
      quantity: sparePart.quantity + req.body.stockInQuantity,
      totalPrice: (sparePart.quantity + req.body.stockInQuantity) * sparePart.unitPrice
    });

    res.send(stockIn);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error occurred while creating stock in record."
    });
  }
};

// Get all stock in records
exports.findAll = async (req, res) => {
  try {
    const stockIns = await StockIn.findAll({
      include: [{
        model: SparePart,
        attributes: ['name', 'category']
      }]
    });
    res.send(stockIns);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error occurred while retrieving stock in records."
    });
  }
}; 