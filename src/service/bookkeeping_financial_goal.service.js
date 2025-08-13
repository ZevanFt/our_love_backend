const {
  getFinancialGoalModel,
} = require('../model/bookkeeping_financial_goal.model');
const { accessService } = require('../utils/console.utils');

/**
 * BookkeepingFinancialGoalService 类，封装了与财务目标相关的数据库操作服务
 */
class BookkeepingFinancialGoalService {
  /**
   * 创建新财务目标的异步方法
   * @param {object} goalData - 财务目标数据
   * @returns {Promise<object>} - 新创建财务目标的数据库记录数据
   */
  async createFinancialGoal(goalData) {
    accessService('createFinancialGoal');
    const FinancialGoal = await getFinancialGoalModel();
    const res = await FinancialGoal.create(goalData);
    return res.dataValues;
  }

  /**
   * 根据 couple_link_id 查询财务目标列表
   * @param {string} couple_link_id - 情侣关系ID
   * @returns {Promise<Array<object>>} - 财务目标列表
   */
  async getFinancialGoalsByCoupleId(couple_link_id) {
    accessService('getFinancialGoalsByCoupleId');
    const FinancialGoal = await getFinancialGoalModel();
    const goals = await FinancialGoal.findAll({
      where: { couple_link_id },
    });
    return goals.map((goal) => goal.dataValues);
  }

  /**
   * 更新财务目标
   * @param {number} id - 财务目标ID
   * @param {object} updateData - 要更新的数据
   * @returns {Promise<Array<number>>} - 更新操作的结果
   */
  async updateFinancialGoal(id, updateData) {
    accessService('updateFinancialGoal');
    const FinancialGoal = await getFinancialGoalModel();
    const res = await FinancialGoal.update(updateData, {
      where: { id },
    });
    return res;
  }

  /**
   * 删除财务目标
   * @param {number} id - 财务目标ID
   * @returns {Promise<number>} - 删除操作的结果
   */
  async deleteFinancialGoal(id) {
    accessService('deleteFinancialGoal');
    const FinancialGoal = await getFinancialGoalModel();
    const res = await FinancialGoal.destroy({
      where: { id },
    });
    return res;
  }
}

module.exports = new BookkeepingFinancialGoalService();
