import { Sequelize, DataTypes } from 'sequelize';

import dbConfig from '../config/db.config.js';

export const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.PORT,
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
  },
);

import createTagModel from './tag.model.js';
import createClientModel from './client.model.js';
import createAbiiUserModel from './abii_user.model.js';
import createTransactionModel from './transaction.model.js';
import createProductSalesModel from './product_sales.model.js';
import createProductModel from './product.model.js';
import createMembershipModel from './membership.model.js';
import createMembershipSalesModel from './membership_sales.model.js';

export const Tags = createTagModel(sequelize, DataTypes);
export const Clients = createClientModel(sequelize, DataTypes);
export const AbiiUsers = createAbiiUserModel(sequelize, DataTypes);
export const Transactions = createTransactionModel(sequelize, DataTypes);
export const ProductSales = createProductSalesModel(sequelize, DataTypes);
export const Products = createProductModel(sequelize, DataTypes);
export const Memberships = createMembershipModel(sequelize, DataTypes);
export const MembershipSales = createMembershipSalesModel(sequelize, DataTypes);

export const db = {
  sequelize,
  Tags,
  Clients,
  AbiiUsers,
  Transactions,
  ProductSales,
  Products,
  Memberships,
  MembershipSales,
};

// Product <-> Tag
Products.belongsToMany(Tags, {
  through: 'product_tags',
  foreignKey: 'productId',
});
Tags.belongsToMany(Products, {
  through: 'product_tags',
  foreignKey: 'tagId',
});

// Transaction <-> Client
Transactions.belongsTo(Clients, {
  foreignKey: 'clientId',
});
Clients.hasMany(Transactions, {
  foreignKey: 'clientId',
});

// Transaction <-> AbiiUser
Transactions.belongsTo(AbiiUsers, {
  foreignKey: 'abiiUserId',
});
AbiiUsers.hasMany(Transactions, {
  foreignKey: 'abiiUserId',
});

// Transaction <-> Product
Transactions.belongsToMany(Products, {
  through: ProductSales,
  foreignKey: 'transactionId',
});
Products.belongsToMany(Transactions, {
  through: ProductSales,
  foreignKey: 'productId',
});

// Transaction <-> Membership
Transactions.belongsToMany(Memberships, {
  through: 'memberships_sales',
  foreignKey: 'transactionId',
});
Memberships.belongsToMany(Transactions, {
  through: 'memberships_sales',
  foreignKey: 'membershipId',
});

export default db;
