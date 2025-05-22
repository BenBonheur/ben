const db = require("../models");
const StockOut = db.stockOut;
const SparePart = db.sparePart;

// Create a new stock out record
exports.create = async (req, res) => {
  try {
    const sparePart = await SparePart.findByPk(req.body.sparePartId);
    if (!sparePart) {
      return res.status(404).send({
        message: "Spare part not found!"
      });
    }

    if (sparePart.quantity < req.body.stockOutQuantity) {
      return res.status(400).send({
        message: "Insufficient stock quantity!"
      });
    }

    const stockOut = await StockOut.create({
      stockOutQuantity: req.body.stockOutQuantity,
      stockOutUnitPrice: sparePart.unitPrice,
      stockOutTotalPrice: req.body.stockOutQuantity * sparePart.unitPrice,
      sparePartId: req.body.sparePartId
    });

    // Update spare part quantity
    await sparePart.update({
      quantity: sparePart.quantity - req.body.stockOutQuantity,
      totalPrice: (sparePart.quantity - req.body.stockOutQuantity) * sparePart.unitPrice
    });

    res.send(stockOut);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error occurred while creating stock out record."
    });
  }
};

// Get all stock out records
exports.findAll = async (req, res) => {
  try {
    const stockOuts = await StockOut.findAll({
      include: [{
        model: SparePart,
        attributes: ['name', 'category']
      }]
    });
    res.send(stockOuts);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error occurred while retrieving stock out records."
    });
  }
};

// Get daily stock out report
exports.getDailyReport = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stockOuts = await StockOut.findAll({
      where: {
        stockOutDate: {
          [db.Sequelize.Op.gte]: today
        }
      },
      include: [{
        model: SparePart,
        attributes: ['name', 'category']
      }]
    });

    res.send(stockOuts);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error occurred while retrieving daily report."
    });
  }
}; 