const { DataTypes } = require('sequelize');
const { seq } = require('../db/seq');

// 定义一个 Promise 来存储 TokenBlacklist 模型的初始化结果
let tokenBlacklistModelPromise;

// 立即执行的异步函数，用于初始化 TokenBlacklist 模型
(async () => {
  try {
    // 等待 Sequelize 实例初始化完成

    tokenBlacklistModelPromise = new Promise((resolve) => {
      /**
       * 定义令牌黑名单模型
       * @param {string} 'token_blacklist' - 模型名称，Sequelize 会根据该名称自动生成表名
       * @param {object} 字段定义对象 - 包含令牌黑名单模型的各个字段及其属性
       * @param {object} 模型选项 - 包含表名、注释、时间戳等配置
       */
      const TokenBlacklist = seq.define(
        'token_blacklist',
        {
          token: {
            type: DataTypes.STRING(512),
            allowNull: false,
            unique: true,
            comment: '失效的 JWT 令牌',
          },
          expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: '令牌过期时间',
          },
        },
        {
          tableName: 'lovedb_token_blacklist',
          comment: '令牌黑名单表',
          timestamps: true,
        },
      );
      // { alter: true }
      // 同步数据库
      TokenBlacklist.sync()
        .then(() => {
          console.log('令牌黑名单-数据库表结构已更新');
          resolve(TokenBlacklist);
        })
        .catch((error) => {
          console.error('无法更新令牌黑名单数据库表:', error);
          throw error;
        });
    });
  } catch (error) {
    console.error('初始化 TokenBlacklist 模型失败:', error);
    throw error;
  }
})();

// 导出一个 Promise，用于获取 TokenBlacklist 模型
module.exports = {
  getTokenBlacklistModel: () => tokenBlacklistModelPromise,
};
