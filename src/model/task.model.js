const { DataTypes } = require('sequelize');
const { seq } = require('../db/seq');
const { getUserModel } = require('./user.model');

let TaskModel;

const initializeTaskModel = async () => {
  try {
    const User = await getUserModel();
    TaskModel = seq.define(
      'task',
      {
        couple_link_id: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          comment: '情侣关系链接-链接ID',
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: '任务标题',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: '任务描述',
        },
        points_reward: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: '完成任务奖励的积分',
        },
        publisher_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: '发布者ID',
          references: {
            model: User,
            key: 'id',
          },
        },
        assignee_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: '执行者ID',
          references: {
            model: User,
            key: 'id',
          },
        },
        status: {
          type: DataTypes.ENUM('pending', 'completed', 'confirmed'),
          allowNull: false,
          defaultValue: 'pending',
          comment: '任务状态',
        },
        deadline: {
          type: DataTypes.DATE,
          allowNull: true,
          comment: '任务截止日期',
        },
      },
      {
        tableName: 'lovedb_tasks',
        comment: '任务表',
        timestamps: true,
        paranoid: true,
      },
    );

    TaskModel.belongsTo(User, { as: 'Publisher', foreignKey: 'publisher_id' });
    TaskModel.belongsTo(User, { as: 'Assignee', foreignKey: 'assignee_id' });

    await TaskModel.sync({ alter: true });
    console.log('任务-数据库表结构已同步');
    return TaskModel;
  } catch (error) {
    console.error('初始化 Task 模型失败:', error);
    throw error;
  }
};

const getTaskModel = async () => {
  if (!TaskModel) {
    await initializeTaskModel();
  }
  return TaskModel;
};

module.exports = {
  getTaskModel,
};
