const { DataTypes } = require('sequelize');
const { seq } = require('../db/seq');
const { getUserModel } = require('./user.model'); // 引入异步获取的User模型

let PointModel;

const initializePointModel = async () => {
  try {
    const User = await getUserModel(); // 等待User模型初始化完成
    PointModel = seq.define(
      'point_record',
      {
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: '用户ID',
          references: {
            model: User,
            key: 'id',
          },
        },
        type: {
          type: DataTypes.ENUM('earn', 'spend'),
          allowNull: false,
          comment: '记录类型 (earn: 获得, spend: 消费)',
        },
        amount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: '积分数量',
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: '积分变更描述',
        },
        related_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment: '关联ID (例如: 兑换的商品ID)',
        },
      },
      {
        tableName: 'lovedb_point_record',
        comment: '积分记录表',
        timestamps: true,
        paranoid: true,
      },
    );

    PointModel.belongsTo(User, { foreignKey: 'user_id' });
    User.hasMany(PointModel, { foreignKey: 'user_id' });

    await PointModel.sync();
    console.log('积分记录-数据库表结构已更新');
    return PointModel;
  } catch (error) {
    console.error('初始化 Point 模型失败:', error);
    throw error;
  }
};

const getPointModel = async () => {
  if (!PointModel) {
    await initializePointModel();
  }
  return PointModel;
};

module.exports = {
  getPointModel,
};
