const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.sparePart = require("./sparePart.model.js")(sequelize, Sequelize);
db.stockIn = require("./stockIn.model.js")(sequelize, Sequelize);
db.stockOut = require("./stockOut.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);

// Define relationships
db.sparePart.hasMany(db.stockIn);
db.sparePart.hasMany(db.stockOut);
db.stockIn.belongsTo(db.sparePart);
db.stockOut.belongsTo(db.sparePart);

module.exports = db; 