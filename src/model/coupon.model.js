const { DataTypes } = require('sequelize');
const { seq } = require('../db/seq');
const { getUserModel } = require('./user.model');
const { getProductModel } = require('./product.model');

let CouponModel;

const initializeCouponModel = async () => {
  try {
    const User = await getUserModel();
    const Product = await getProductModel();
    CouponModel = seq.define(
      'coupon',
      {
        card_id: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          unique: true,
          comment: '唯一的卡券ID (用于核销)',
        },
        couple_link_id: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          comment: '情侣关系链接-链接ID',
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: '持有者ID',
          references: {
            model: User,
            key: 'id',
          },
        },
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: '关联的商品ID',
          references: {
            model: Product,
            key: 'id',
          },
        },
        status: {
          type: DataTypes.ENUM(
            'unused',
            'pending_confirmation',
            'redeemed',
            'expired',
          ),
          allowNull: false,
          defaultValue: 'unused',
          comment: '卡券状态',
        },
        used_at: {
          type: DataTypes.DATE,
          allowNull: true,
          comment: '核销时间',
        },
        verifier_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment: '核销人ID',
          references: {
            model: User,
            key: 'id',
          },
        },
        expires_at: {
          type: DataTypes.DATE,
          allowNull: true,
          comment: '卡券过期时间, null表示永久有效',
        },
      },
      {
        tableName: 'lovedb_coupons',
        comment: '优惠券表',
        timestamps: true,
        paranoid: true,
      },
    );

    CouponModel.belongsTo(User, { as: 'Owner', foreignKey: 'user_id' });
    CouponModel.belongsTo(User, { as: 'Verifier', foreignKey: 'verifier_id' });
    CouponModel.belongsTo(Product, { foreignKey: 'product_id' });

    await CouponModel.sync({ alter: true });
    console.log('优惠券-数据库表结构已同步');
    return CouponModel;
  } catch (error) {
    console.error('初始化 Coupon 模型失败:', error);
    throw error;
  }
};

const getCouponModel = async () => {
  if (!CouponModel) {
    await initializeCouponModel();
  }
  return CouponModel;
};

module.exports = {
  getCouponModel,
};
