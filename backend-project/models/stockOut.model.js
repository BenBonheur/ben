module.exports = (sequelize, Sequelize) => {
  const StockOut = sequelize.define("stock_out", {
    stockOutQuantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    stockOutUnitPrice: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    stockOutTotalPrice: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    stockOutDate: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  });

  return StockOut;
}; 