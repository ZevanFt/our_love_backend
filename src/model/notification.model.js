const { DataTypes } = require('sequelize');
const { seq } = require('../db/seq');

// 初始化 Notification 模型的函数
const initializeNotificationModel = async () => {
  try {
    const Notification = seq.define(
      'notification',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          comment: '通知唯一标识符',
        },
        receiver_id: {
          // 修改字段类型为 JSON，可存储数组
          type: DataTypes.JSON,
          allowNull: false,
          comment: '接收者用户ID数组',
        },
        sender_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          // 当通知为官方通知时，发送者用户 ID 为 0
          comment: '发送者用户ID',
        },
        // 将 type 字段类型从 ENUM 改为 STRING
        type: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: '通知类型，不做限制',
        },
        content: {
          type: DataTypes.TEXT,
          comment: '通知内容',
        },
        status: {
          type: DataTypes.ENUM('unread', 'read', 'accepted', 'rejected'),
          defaultValue: 'unread',
          comment: '通知状态',
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          comment: '通知创建时间',
        },
      },
      {
        tableName: 'lovedb_notifications',
        comment: '通知表',
        timestamps: false,
      },
    );

    // 使用 alter: true 同步数据库表结构
    await Notification.sync({ alter: true });
    console.log('通知-数据库表结构已更新');
    return Notification;
  } catch (error) {
    console.error('初始化 Notification 模型失败:', error);
    throw error;
  }
};

// 获取 Notification 模型的函数
const getNotificationModel = async () => {
  return initializeNotificationModel();
};

module.exports = {
  getNotificationModel,
};
