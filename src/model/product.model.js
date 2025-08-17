const { DataTypes } = require('sequelize');
const { seq } = require('../db/seq');
const { getUserModel } = require('./user.model');

let ProductModel;

const initializeProductModel = async () => {
  try {
    const User = await getUserModel();
    ProductModel = seq.define(
      'product',
      {
        publisher_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: '发布者ID',
          references: {
            model: User,
            key: 'id',
          },
        },
        couple_link_id: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          comment: '情侣关系链接-链接ID',
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: '商品名称',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: '商品描述',
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true,
          comment: '商品图片',
        },
        points_cost: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: '兑换所需积分',
        },
        stock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: '商品库存',
        },
        status: {
          type: DataTypes.TINYINT(1),
          allowNull: false,
          defaultValue: 1,
          comment: '商品状态 (1: true,上架, 0: false,下架)',
        },
        validity_period: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment: '兑换后的有效天数, null表示永久有效',
        },
        available_from: {
          type: DataTypes.DATE,
          allowNull: true,
          comment: '可兑换开始时间',
        },
        available_until: {
          type: DataTypes.DATE,
          allowNull: true,
          comment: '可兑换结束时间',
        },
        tag: {
          type: DataTypes.ENUM('limited', 'new', 'hot', 'special'),
          allowNull: true,
          comment:
            '商品标签 (limited: 限定, new: 新品, hot: 热门, special: 特别推荐)',
        },
      },
      {
        tableName: 'lovedb_product',
        comment: '商品表',
        timestamps: true,
        paranoid: true,
      },
    );

    const { getCouponModel } = require('./coupon.model');
    const Coupon = await getCouponModel();
    ProductModel.belongsTo(User, {
      as: 'Publisher',
      foreignKey: 'publisher_id',
    });
    ProductModel.hasMany(Coupon, { foreignKey: 'product_id' });

    await ProductModel.sync({ alter: true });
    console.log('商品-数据库表结构已同步');
    return ProductModel;
  } catch (error) {
    console.error('初始化 Product 模型失败:', error);
    throw error;
  }
};

const getProductModel = async () => {
  if (!ProductModel) {
    await initializeProductModel();
  }
  return ProductModel;
};

module.exports = {
  getProductModel,
};
