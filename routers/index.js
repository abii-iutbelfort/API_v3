import createTagRouter from './tag.router.js';
import createClientRouter from './client.router.js';
import createAuthRouter from './auth.router.js';
import createProductRouter from './product.router.js';
import createTransactionRouter from './transaction.router.js';

export default [
  createTagRouter,
  createClientRouter,
  createAuthRouter,
  createProductRouter,
  createTransactionRouter,
];
