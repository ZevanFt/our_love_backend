const { DataTypes } = require('sequelize');
const { seq } = require('../db/seq');
const { getUserModel } = require('./user.model');

// 存储 Account 模型的变量
let AccountModel;

// 初始化 Account 模型的函数
const initializeAccountModel = async () => {
  try {
    const User = await getUserModel();
    AccountModel = seq.define(
      'bookkeeping_account',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          comment: '账户唯一标识符',
        },
        couple_link_id: {
          type: DataTypes.UUID,
          allowNull: false,
          comment: '情侣关系唯一链接ID，关联到用户表',
          references: {
            model: User,
            key: 'couple_link_id',
          },
        },
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
          comment: '账户名称 (如: 日常开销, 投资增值)',
        },
        type: {
          type: DataTypes.ENUM(
            'SPENDING',
            'INVESTMENT',
            'EMERGENCY',
            'SAVINGS',
          ),
          allowNull: false,
          comment:
            '账户类型 (SPENDING: 消费, INVESTMENT: 投资, EMERGENCY: 应急, SAVINGS: 储蓄)',
        },
        balance: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.0,
          comment: '账户当前余额',
        },
        description: {
          type: DataTypes.STRING(255),
          allowNull: true,
          comment: '账户描述',
        },
      },
      {
        tableName: 'lovedb_bookkeeping_accounts',
        comment: '记账功能-资金账户表',
        timestamps: true,
        paranoid: true,
      },
    );

    await AccountModel.sync({ alter: true });
    console.log('资金账户-数据库表结构已更新');
    return AccountModel;
  } catch (error) {
    console.error('初始化 Account 模型失败:', error);
    throw error;
  }
};

// 获取 Account 模型的函数
const getAccountModel = async () => {
  if (!AccountModel) {
    await initializeAccountModel();
  }
  return AccountModel;
};

module.exports = {
  getAccountModel,
};
