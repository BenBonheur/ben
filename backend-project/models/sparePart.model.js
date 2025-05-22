module.exports = (sequelize, Sequelize) => {
  const SparePart = sequelize.define("spare_part", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    category: {
      type: Sequelize.STRING,
      allowNull: false
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    unitPrice: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    totalPrice: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    }
  });

  return SparePart;
}; 