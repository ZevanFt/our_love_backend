const transactionService = require('../service/bookkeeping_transaction.service');
const { bookkeepingTransactionError } = require('../constant/err.type');

class BookkeepingTransactionController {
  // 创建交易
  async createTransaction(ctx) {
    try {
      const { user_id } = ctx.state.user;
      const {
        account_id,
        category_id,
        amount,
        transaction_type,
        transaction_date,
        description,
      } = ctx.request.body;
      const res = await transactionService.createTransaction({
        user_id,
        account_id,
        category_id,
        amount,
        transaction_type,
        transaction_date,
        description,
      });
      ctx.body = {
        code: 0,
        message: '创建交易成功',
        result: res,
      };
    } catch (err) {
      console.error('创建交易失败', err);
      return ctx.app.emit(
        'error',
        bookkeepingTransactionError.createTransactionError,
        ctx,
      );
    }
  }

  // 获取所有交易
  async getAllTransactions(ctx) {
    try {
      const { user_id } = ctx.state.user;
      const res = await transactionService.getAllTransactions(user_id);
      ctx.body = {
        code: 0,
        message: '获取交易列表成功',
        result: res,
      };
    } catch (err) {
      console.error('获取交易列表失败', err);
      return ctx.app.emit(
        'error',
        bookkeepingTransactionError.getAllTransactionsError,
        ctx,
      );
    }
  }

  // 更新交易
  async updateTransaction(ctx) {
    try {
      const { id } = ctx.params;
      const {
        account_id,
        category_id,
        amount,
        transaction_type,
        transaction_date,
        description,
      } = ctx.request.body;
      const res = await transactionService.updateTransaction(id, {
        account_id,
        category_id,
        amount,
        transaction_type,
        transaction_date,
        description,
      });
      if (res) {
        ctx.body = {
          code: 0,
          message: '更新交易成功',
          result: '',
        };
      } else {
        return ctx.app.emit(
          'error',
          bookkeepingTransactionError.updateTransactionError,
          ctx,
        );
      }
    } catch (err) {
      console.error('更新交易失败', err);
      return ctx.app.emit(
        'error',
        bookkeepingTransactionError.updateTransactionError,
        ctx,
      );
    }
  }

  // 删除交易
  async deleteTransaction(ctx) {
    try {
      const { id } = ctx.params;
      const res = await transactionService.deleteTransaction(id);
      if (res) {
        ctx.body = {
          code: 0,
          message: '删除交易成功',
          result: '',
        };
      } else {
        return ctx.app.emit(
          'error',
          bookkeepingTransactionError.deleteTransactionError,
          ctx,
        );
      }
    } catch (err) {
      console.error('删除交易失败', err);
      return ctx.app.emit(
        'error',
        bookkeepingTransactionError.deleteTransactionError,
        ctx,
      );
    }
  }
}

module.exports = new BookkeepingTransactionController();
