module.exports = (sequelize, Sequelize) => {
  const StockIn = sequelize.define("stock_in", {
    stockInQuantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    stockInDate: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  });

  return StockIn;
}; 