const { Sequelize, DataTypes } = require("sequelize");

const dbConfig = require("../config/db.config.js");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  define: {
    timestamps: false,
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  freezeTableName: true,
});

const db = {};
db.sequelize = sequelize;

db.Tags = require("./tag.model.js")(sequelize, DataTypes);
db.Clients = require("./client.model.js")(sequelize, DataTypes);
db.AbiiUsers = require("./abii_user.model.js")(sequelize, DataTypes);
db.Transactions = require("./transaction.model.js")(sequelize, DataTypes);
db.ProductsSales = require("./product_sales.model.js")(sequelize, DataTypes);
db.Products = require("./product.model.js")(sequelize, DataTypes);
db.Memberships = require("./membership.model.js")(sequelize, DataTypes);
db.MembershipSales = require("./membership_sales.model.js")(
  sequelize,
  DataTypes
);

// Product <-> Tag
db.Products.belongsToMany(db.Tags, {
  through: "product_tags",
  foreignKey: "productId",
});
db.Tags.belongsToMany(db.Products, {
  through: "product_tags",
  foreignKey: "tagId",
});

// Transaction <-> Client
db.Transactions.belongsTo(db.Clients, {
  foreignKey: "clientId",
});
db.Clients.hasMany(db.Transactions, {
  foreignKey: "clientId",
});

// Transaction <-> AbiiUser
db.Transactions.belongsTo(db.AbiiUsers, {
  foreignKey: "abiiUserId",
});
db.AbiiUsers.hasMany(db.Transactions, {
  foreignKey: "abiiUserId",
});

// Transaction <-> Product
db.Transactions.belongsToMany(db.Products, {
  through: db.ProductsSales,
  foreignKey: "transactionId",
});
db.Products.belongsToMany(db.Transactions, {
  through: db.ProductsSales,
  foreignKey: "productId",
});

// Transaction <-> Membership
db.Transactions.belongsToMany(db.Memberships, {
  through: db.MembershipSales,
  foreignKey: "transactionId",
});
db.Memberships.belongsToMany(db.Transactions, {
  through: db.MembershipSales,
  foreignKey: "membershipId",
});

module.exports = db;
