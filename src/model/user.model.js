const { DataTypes } = require('sequelize');
const { seq } = require('../db/seq');

// 存储 User 模型的变量
let UserModel;

// 初始化 User 模型的函数
const initializeUserModel = async () => {
  try {
    UserModel = seq.define(
      'user',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          comment: '用户唯一标识符',
        },
        yier_number: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          comment: '用户账号',
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false,
          comment: '用户密码',
        },
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
          comment: '用户昵称或显示名称',
          defaultValue: '壹贰-新用户',
        },
        address: {
          type: DataTypes.STRING(100),
          comment: '用户所在地',
        },
        sex: {
          type: DataTypes.ENUM('男', '女'),
          allowNull: true,
          comment: '用户性别',
        },
        birthday: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          comment: '用户生日',
        },
        mate_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment: '伴侣的用户ID',
          references: {
            model: 'lovedb_users',
            key: 'id',
          },
        },
        couple_link_id: {
          type: DataTypes.UUID,
          allowNull: true,
          defaultValue: null,
          unique: true,
          comment: '情侣关系唯一链接ID',
        },
        relationship: {
          type: DataTypes.ENUM('情侣', '夫妻'),
          allowNull: true,
          comment: '伴侣关系类型',
        },
        manifesto: {
          type: DataTypes.STRING(255),
          allowNull: true,
          comment: '用户恋爱宣言',
        },
        manifest_consistent_whether: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          comment: '恋爱宣言是否与伴侣一致',
        },
        couple_nickname: {
          type: DataTypes.STRING(50),
          allowNull: true,
          comment: '情侣关系中的昵称',
        },
        is_admin: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          comment: '是否是超级管理员',
        },
        avatar_url: {
          type: DataTypes.STRING(255),
          allowNull: true,
          comment: '用户头像链接',
        },
        point: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          comment: '用户积分',
        },
        coupleRequestRequesterId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment: '情侣请求发送者的用户 ID',
        },
        coupleRequestTargetId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment: '情侣请求接收者的用户 ID',
        },
        coupleRequestStatus: {
          type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
          allowNull: true,
          comment: '情侣请求的状态',
        },
      },
      {
        tableName: 'lovedb_users',
        comment: '用户表',
        timestamps: true,
        paranoid: true,
      },
    );

    await UserModel.sync();
    console.log('用户-数据库表结构已更新');
    return UserModel;
  } catch (error) {
    console.error('初始化 User 模型失败:', error);
    throw error;
  }
};

// 获取 User 模型的函数，如果模型未初始化则先初始化
const getUserModel = async () => {
  if (!UserModel) {
    await initializeUserModel();
  }
  return UserModel;
};

module.exports = {
  getUserModel,
};
