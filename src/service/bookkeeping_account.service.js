const { getAccountModel } = require('../model/bookkeeping_account.model');
const { accessService } = require('../utils/console.utils');

/**
 * BookkeepingAccountService 类，封装了与资金账户相关的数据库操作服务
 */
class BookkeepingAccountService {
  /**
   * 创建新账户的异步方法
   * @param {object} accountData - 账户数据
   * @param {string} accountData.couple_link_id - 情侣关系ID
   * @param {string} accountData.name - 账户名称
   * @param {string} accountData.type - 账户类型
   * @param {number} accountData.balance - 初始余额
   * @param {string} [accountData.description] - 账户描述
   * @returns {Promise<object>} - 新创建账户的数据库记录数据
   */
  async createAccount({ couple_link_id, name, type, balance, description }) {
    accessService('createAccount');
    const Account = await getAccountModel();
    const res = await Account.create({
      couple_link_id,
      name,
      type,
      balance,
      description,
    });
    return res.dataValues;
  }

  /**
   * 根据 couple_link_id 查询账户列表的异步方法
   * @param {string} couple_link_id - 情侣关系ID
   * @returns {Promise<Array<object>>} - 账户列表
   */
  async getAccountsByCoupleId(couple_link_id) {
    accessService('getAccountsByCoupleId');
    const Account = await getAccountModel();
    const accounts = await Account.findAll({
      where: { couple_link_id },
    });
    return accounts.map((account) => account.dataValues);
  }

  /**
   * 根据ID查询单个账户的异步方法
   * @param {number} id - 账户ID
   * @returns {Promise<object|null>} - 账户数据或null
   */
  async getAccountById(id) {
    accessService('getAccountById');
    const Account = await getAccountModel();
    const account = await Account.findByPk(id);
    return account ? account.dataValues : null;
  }

  /**
   * 更新账户信息的异步方法
   * @param {number} id - 账户ID
   * @param {object} updateData - 要更新的账户数据
   * @returns {Promise<Array<number>>} - 更新操作的结果
   */
  async updateAccount(id, updateData) {
    accessService('updateAccount');
    const Account = await getAccountModel();
    const res = await Account.update(updateData, {
      where: { id },
    });
    return res;
  }

  /**
   * 删除账户的异步方法
   * @param {number} id - 账户ID
   * @returns {Promise<number>} - 删除操作的结果
   */
  async deleteAccount(id) {
    accessService('deleteAccount');
    const Account = await getAccountModel();
    const res = await Account.destroy({
      where: { id },
    });
    return res;
  }
}

module.exports = new BookkeepingAccountService();
