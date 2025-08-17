const Router = require('@koa/router');

const { auth } = require('../middleware/auth.middleware');
const accountController = require('../controller/bookkeeping_account.controller');
const categoryController = require('../controller/bookkeeping_category.controller');
const transactionController = require('../controller/bookkeeping_transaction.controller');
const financialGoalController = require('../controller/bookkeeping_financial_goal.controller');

const router = new Router({ prefix: '/bookkeeping' });

// 账户管理路由
router.post('/accounts', auth, accountController.createAccount);
router.get('/accounts', auth, accountController.getAllAccounts);
router.put('/accounts/:id', auth, accountController.updateAccount);
router.delete('/accounts/:id', auth, accountController.deleteAccount);

// 分类管理路由
router.post('/categories', auth, categoryController.createCategory);
router.get('/categories', auth, categoryController.getAllCategories);
router.put('/categories/:id', auth, categoryController.updateCategory);
router.delete('/categories/:id', auth, categoryController.deleteCategory);

// 交易记录路由
router.post('/transactions', auth, transactionController.createTransaction);
router.get('/transactions', auth, transactionController.getAllTransactions);
router.put('/transactions/:id', auth, transactionController.updateTransaction);
router.delete(
  '/transactions/:id',
  auth,
  transactionController.deleteTransaction,
);

// 财务目标路由
router.post(
  '/financial-goals',
  auth,
  financialGoalController.createFinancialGoal,
);
router.get(
  '/financial-goals',
  auth,
  financialGoalController.getAllFinancialGoals,
);
router.put(
  '/financial-goals/:id',
  auth,
  financialGoalController.updateFinancialGoal,
);
router.delete(
  '/financial-goals/:id',
  auth,
  financialGoalController.deleteFinancialGoal,
);

module.exports = router;
