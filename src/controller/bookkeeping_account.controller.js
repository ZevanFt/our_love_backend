const accountService = require('../service/bookkeeping_account.service');
const { bookkeepingAccountError } = require('../constant/err.type');

class BookkeepingAccountController {
  // 创建账户
  async createAccount(ctx) {
    try {
      const { user_id } = ctx.state.user;
      const { account_name, account_type, balance } = ctx.request.body;
      const res = await accountService.createAccount({
        user_id,
        account_name,
        account_type,
        balance,
      });
      ctx.body = {
        code: 0,
        message: '创建账户成功',
        result: res,
      };
    } catch (err) {
      console.error('创建账户失败', err);
      return ctx.app.emit(
        'error',
        bookkeepingAccountError.createAccountError,
        ctx,
      );
    }
  }

  // 获取用户的所有账户
  async getAllAccounts(ctx) {
    try {
      const { user_id } = ctx.state.user;
      const res = await accountService.getAllAccounts(user_id);
      ctx.body = {
        code: 0,
        message: '获取账户列表成功',
        result: res,
      };
    } catch (err) {
      console.error('获取账户列表失败', err);
      return ctx.app.emit(
        'error',
        bookkeepingAccountError.getAllAccountsError,
        ctx,
      );
    }
  }

  // 更新账户
  async updateAccount(ctx) {
    try {
      const { id } = ctx.params;
      const { account_name, account_type, balance } = ctx.request.body;
      const res = await accountService.updateAccount(id, {
        account_name,
        account_type,
        balance,
      });
      if (res) {
        ctx.body = {
          code: 0,
          message: '更新账户成功',
          result: '',
        };
      } else {
        return ctx.app.emit(
          'error',
          bookkeepingAccountError.updateAccountError,
          ctx,
        );
      }
    } catch (err) {
      console.error('更新账户失败', err);
      return ctx.app.emit(
        'error',
        bookkeepingAccountError.updateAccountError,
        ctx,
      );
    }
  }

  // 删除账户
  async deleteAccount(ctx) {
    try {
      const { id } = ctx.params;
      const res = await accountService.deleteAccount(id);
      if (res) {
        ctx.body = {
          code: 0,
          message: '删除账户成功',
          result: '',
        };
      } else {
        return ctx.app.emit(
          'error',
          bookkeepingAccountError.deleteAccountError,
          ctx,
        );
      }
    } catch (err) {
      console.error('删除账户失败', err);
      return ctx.app.emit(
        'error',
        bookkeepingAccountError.deleteAccountError,
        ctx,
      );
    }
  }
}

module.exports = new BookkeepingAccountController();
