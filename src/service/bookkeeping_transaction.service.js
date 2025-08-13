const {
  getTransactionModel,
} = require('../model/bookkeeping_transaction.model');
const { getAccountModel } = require('../model/bookkeeping_account.model');
const { seq } = require('../db/seq');
const { accessService } = require('../utils/console.utils');

/**
 * BookkeepingTransactionService 类，封装了与交易记录相关的数据库操作服务
 */
class BookkeepingTransactionService {
  /**
   * 创建新交易的异步方法
   * @param {object} transactionData - 交易数据
   * @returns {Promise<object>} - 新创建交易的数据库记录数据
   */
  async createTransaction(transactionData) {
    accessService('createTransaction');
    const { account_id, type, amount } = transactionData;
    const Transaction = await getTransactionModel();
    const Account = await getAccountModel();

    return seq.transaction(async (t) => {
      const transaction = await Transaction.create(transactionData, {
        transaction: t,
      });

      const account = await Account.findByPk(account_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!account) {
        throw new Error('Account not found');
      }

      if (type === 'INCOME') {
        account.balance = parseFloat(account.balance) + parseFloat(amount);
      } else if (type === 'EXPENSE') {
        account.balance = parseFloat(account.balance) - parseFloat(amount);
      }
      // 'TRANSFER' 类型需要更复杂的逻辑，暂时不在这里处理

      await account.save({ transaction: t });

      return transaction.dataValues;
    });
  }

  /**
   * 根据账户ID查询交易列表
   * @param {number} account_id - 账户ID
   * @returns {Promise<Array<object>>} - 交易列表
   */
  async getTransactionsByAccountId(account_id) {
    accessService('getTransactionsByAccountId');
    const Transaction = await getTransactionModel();
    const transactions = await Transaction.findAll({
      where: { account_id },
      order: [['transaction_date', 'DESC']],
    });
    return transactions.map((t) => t.dataValues);
  }

  /**
   * 删除交易的异步方法
   * @param {number} id - 交易ID
   * @returns {Promise<number>} - 删除操作的结果
   */
  async deleteTransaction(id) {
    accessService('deleteTransaction');
    const Transaction = await getTransactionModel();
    const Account = await getAccountModel();

    return seq.transaction(async (t) => {
      const transaction = await Transaction.findByPk(id, { transaction: t });
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      const { account_id, type, amount } = transaction;
      const account = await Account.findByPk(account_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!account) {
        throw new Error('Account not found');
      }

      if (type === 'INCOME') {
        account.balance = parseFloat(account.balance) - parseFloat(amount);
      } else if (type === 'EXPENSE') {
        account.balance = parseFloat(account.balance) + parseFloat(amount);
      }

      await account.save({ transaction: t });
      const res = await Transaction.destroy({ where: { id }, transaction: t });
      return res;
    });
  }
}

module.exports = new BookkeepingTransactionService();
