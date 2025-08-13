const financialGoalService = require('../service/bookkeeping_financial_goal.service');
const { bookkeepingFinancialGoalError } = require('../constant/err.type');

class BookkeepingFinancialGoalController {
  // 创建财务目标
  async createFinancialGoal(ctx) {
    try {
      const { user_id } = ctx.state.user;
      const { goal_name, target_amount, current_amount, due_date } =
        ctx.request.body;
      const res = await financialGoalService.createFinancialGoal({
        user_id,
        goal_name,
        target_amount,
        current_amount,
        due_date,
      });
      ctx.body = {
        code: 0,
        message: '创建财务目标成功',
        result: res,
      };
    } catch (err) {
      console.error('创建财务目标失败', err);
      return ctx.app.emit(
        'error',
        bookkeepingFinancialGoalError.createFinancialGoalError,
        ctx,
      );
    }
  }

  // 获取所有财务目标
  async getAllFinancialGoals(ctx) {
    try {
      const { user_id } = ctx.state.user;
      const res = await financialGoalService.getAllFinancialGoals(user_id);
      ctx.body = {
        code: 0,
        message: '获取财务目标列表成功',
        result: res,
      };
    } catch (err) {
      console.error('获取财务目标列表失败', err);
      return ctx.app.emit(
        'error',
        bookkeepingFinancialGoalError.getAllFinancialGoalsError,
        ctx,
      );
    }
  }

  // 更新财务目标
  async updateFinancialGoal(ctx) {
    try {
      const { id } = ctx.params;
      const { goal_name, target_amount, current_amount, due_date } =
        ctx.request.body;
      const res = await financialGoalService.updateFinancialGoal(id, {
        goal_name,
        target_amount,
        current_amount,
        due_date,
      });
      if (res) {
        ctx.body = {
          code: 0,
          message: '更新财务目标成功',
          result: '',
        };
      } else {
        return ctx.app.emit(
          'error',
          bookkeepingFinancialGoalError.updateFinancialGoalError,
          ctx,
        );
      }
    } catch (err) {
      console.error('更新财务目标失败', err);
      return ctx.app.emit(
        'error',
        bookkeepingFinancialGoalError.updateFinancialGoalError,
        ctx,
      );
    }
  }

  // 删除财务目标
  async deleteFinancialGoal(ctx) {
    try {
      const { id } = ctx.params;
      const res = await financialGoalService.deleteFinancialGoal(id);
      if (res) {
        ctx.body = {
          code: 0,
          message: '删除财务目标成功',
          result: '',
        };
      } else {
        return ctx.app.emit(
          'error',
          bookkeepingFinancialGoalError.deleteFinancialGoalError,
          ctx,
        );
      }
    } catch (err) {
      console.error('删除财务目标失败', err);
      return ctx.app.emit(
        'error',
        bookkeepingFinancialGoalError.deleteFinancialGoalError,
        ctx,
      );
    }
  }
}

module.exports = new BookkeepingFinancialGoalController();
