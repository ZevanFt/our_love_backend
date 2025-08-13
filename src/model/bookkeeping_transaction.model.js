const { DataTypes } = require('sequelize');
const { seq } = require('../db/seq');
const { getUserModel } = require('./user.model');
const { getAccountModel } = require('./bookkeeping_account.model');
const { getCategoryModel } = require('./bookkeeping_category.model');

// 存储 Transaction 模型的变量
let TransactionModel;

// 初始化 Transaction 模型的函数
const initializeTransactionModel = async () => {
  try {
    const User = await getUserModel();
    const Account = await getAccountModel();
    const Category = await getCategoryModel();

    TransactionModel = seq.define(
      'bookkeeping_transaction',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          comment: '交易记录唯一标识符',
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: '记录该笔交易的用户ID',
          references: {
            model: User,
            key: 'id',
          },
        },
        account_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: '关联的资金账户ID',
          references: {
            model: Account,
            key: 'id',
          },
        },
        category_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: '关联的交易分类ID',
          references: {
            model: Category,
            key: 'id',
          },
        },
        type: {
          type: DataTypes.ENUM('INCOME', 'EXPENSE', 'TRANSFER'),
          allowNull: false,
          comment: '交易类型 (INCOME: 收入, EXPENSE: 支出, TRANSFER: 转账)',
        },
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          comment: '交易金额',
        },
        transaction_date: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          comment: '交易发生的日期和时间',
        },
        description: {
          type: DataTypes.STRING(255),
          allowNull: true,
          comment: '交易描述或备注',
        },
      },
      {
        tableName: 'lovedb_bookkeeping_transactions',
        comment: '记账功能-交易记录表',
        timestamps: true,
        paranoid: true,
      },
    );

    await TransactionModel.sync({ alter: true });
    console.log('交易记录-数据库表结构已更新');
    return TransactionModel;
  } catch (error) {
    console.error('初始化 Transaction 模型失败:', error);
    throw error;
  }
};

// 获取 Transaction 模型的函数
const getTransactionModel = async () => {
  if (!TransactionModel) {
    await initializeTransactionModel();
  }
  return TransactionModel;
};

module.exports = {
  getTransactionModel,
};
