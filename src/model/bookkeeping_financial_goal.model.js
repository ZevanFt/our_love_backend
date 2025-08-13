const { DataTypes } = require('sequelize');
const { seq } = require('../db/seq');
const { getUserModel } = require('./user.model');
const { getAccountModel } = require('./bookkeeping_account.model');

// 存储 FinancialGoal 模型的变量
let FinancialGoalModel;

// 初始化 FinancialGoal 模型的函数
const initializeFinancialGoalModel = async () => {
  try {
    const User = await getUserModel();
    const Account = await getAccountModel();

    FinancialGoalModel = seq.define(
      'bookkeeping_financial_goal',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          comment: '财务目标唯一标识符',
        },
        couple_link_id: {
          type: DataTypes.UUID,
          allowNull: false,
          comment: '情侣关系唯一链接ID',
          references: {
            model: User,
            key: 'couple_link_id',
          },
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
          comment: '目标名称 (如: 偿还助学贷款, 百万存款)',
        },
        target_amount: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
          comment: '目标金额',
        },
        current_amount: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.0,
          comment: '当前已存金额',
        },
        target_date: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          comment: '目标完成日期',
        },
        status: {
          type: DataTypes.ENUM('IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
          allowNull: false,
          defaultValue: 'IN_PROGRESS',
          comment:
            '目标状态 (IN_PROGRESS: 进行中, COMPLETED: 已完成, CANCELLED: 已取消)',
        },
        linked_account_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment: '关联到用于此目标的特定储蓄账户ID',
          references: {
            model: Account,
            key: 'id',
          },
        },
      },
      {
        tableName: 'lovedb_bookkeeping_financial_goals',
        comment: '记账功能-财务目标表',
        timestamps: true,
        paranoid: true,
      },
    );

    await FinancialGoalModel.sync({ alter: true });
    console.log('财务目标-数据库表结构已更新');
    return FinancialGoalModel;
  } catch (error) {
    console.error('初始化 FinancialGoal 模型失败:', error);
    throw error;
  }
};

// 获取 FinancialGoal 模型的函数
const getFinancialGoalModel = async () => {
  if (!FinancialGoalModel) {
    await initializeFinancialGoalModel();
  }
  return FinancialGoalModel;
};

module.exports = {
  getFinancialGoalModel,
};
