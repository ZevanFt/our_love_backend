const { DataTypes } = require('sequelize');
const { seq } = require('../db/seq');
const { getUserModel } = require('./user.model');

// 存储 Category 模型的变量
let CategoryModel;

// 初始化 Category 模型的函数
const initializeCategoryModel = async () => {
  try {
    const User = await getUserModel();
    CategoryModel = seq.define(
      'bookkeeping_category',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          comment: '分类唯一标识符',
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
          comment: '分类名称 (如: 餐饮, 工资)',
        },
        type: {
          type: DataTypes.ENUM('INCOME', 'EXPENSE'),
          allowNull: false,
          comment: '分类类型 (INCOME: 收入, EXPENSE: 支出)',
        },
        icon: {
          type: DataTypes.STRING(100),
          allowNull: true,
          comment: '分类图标的URL或标识符',
        },
      },
      {
        tableName: 'lovedb_bookkeeping_categories',
        comment: '记账功能-交易分类表',
        timestamps: true,
        paranoid: true,
      },
    );

    await CategoryModel.sync({ alter: true });
    console.log('交易分类-数据库表结构已更新');
    return CategoryModel;
  } catch (error) {
    console.error('初始化 Category 模型失败:', error);
    throw error;
  }
};

// 获取 Category 模型的函数
const getCategoryModel = async () => {
  if (!CategoryModel) {
    await initializeCategoryModel();
  }
  return CategoryModel;
};

module.exports = {
  getCategoryModel,
};
