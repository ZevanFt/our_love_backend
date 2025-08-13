const Router = require('@koa/router');

const { verifyToken } = require('../middleware/auth.middleware');
const accountController = require('../controller/bookkeeping_account.controller');
const categoryController = require('../controller/bookkeeping_category.controller');
const transactionController = require('../controller/bookkeeping_transaction.controller');
const financialGoalController = require('../controller/bookkeeping_financial_goal.controller');

const router = new Router({ prefix: '/bookkeeping' });

// 账户管理路由
router.post('/accounts', verifyToken, accountController.createAccount);
router.get('/accounts', verifyToken, accountController.getAllAccounts);
router.put('/accounts/:id', verifyToken, accountController.updateAccount);
router.delete('/accounts/:id', verifyToken, accountController.deleteAccount);

// 分类管理路由
router.post('/categories', verifyToken, categoryController.createCategory);
router.get('/categories', verifyToken, categoryController.getAllCategories);
router.put('/categories/:id', verifyToken, categoryController.updateCategory);
router.delete(
  '/categories/:id',
  verifyToken,
  categoryController.deleteCategory,
);

// 交易记录路由
router.post(
  '/transactions',
  verifyToken,
  transactionController.createTransaction,
);
router.get(
  '/transactions',
  verifyToken,
  transactionController.getAllTransactions,
);
router.put(
  '/transactions/:id',
  verifyToken,
  transactionController.updateTransaction,
);
router.delete(
  '/transactions/:id',
  verifyToken,
  transactionController.deleteTransaction,
);

// 财务目标路由
router.post(
  '/financial-goals',
  verifyToken,
  financialGoalController.createFinancialGoal,
);
router.get(
  '/financial-goals',
  verifyToken,
  financialGoalController.getAllFinancialGoals,
);
router.put(
  '/financial-goals/:id',
  verifyToken,
  financialGoalController.updateFinancialGoal,
);
router.delete(
  '/financial-goals/:id',
  verifyToken,
  financialGoalController.deleteFinancialGoal,
);

module.exports = router;
