const { getProductModel } = require('../model/product.model');

class ProductService {
  async createProduct(product) {
    const Product = await getProductModel();
    const res = await Product.create(product);
    return res.dataValues;
  }

  async updateProduct(id, product) {
    const Product = await getProductModel();
    const res = await Product.update(product, { where: { id } });
    return res[0] > 0;
  }

  async removeProduct(id) {
    const Product = await getProductModel();
    const res = await Product.destroy({ where: { id } });
    return res > 0;
  }

  async restoreProduct(id) {
    const Product = await getProductModel();
    const res = await Product.restore({ where: { id } });
    return res > 0;
  }

  async findProducts(pageNum, pageSize, status) {
    const Product = await getProductModel();
    const whereOpt = {};
    if (status !== undefined) {
      whereOpt.status = status;
    }

    const offset = (pageNum - 1) * pageSize;
    const { count, rows } = await Product.findAndCountAll({
      offset,
      limit: pageSize * 1,
      where: whereOpt,
    });

    return {
      total: count,
      list: rows,
    };
  }

  async findProductById(id) {
    const Product = await getProductModel();
    const res = await Product.findByPk(id);
    return res ? res.dataValues : null;
  }

  async findProductsByUser(publisher_id, pageNum, pageSize) {
    const Product = await getProductModel();
    const offset = (pageNum - 1) * pageSize;
    const { count, rows } = await Product.findAndCountAll({
      offset,
      limit: pageSize * 1,
      where: { publisher_id },
    });

    return {
      total: count,
      list: rows,
    };
  }

  async exchangeProduct(userId, productId) {
    const { getPointModel } = require('../model/point.model');
    const { getCouponModel } = require('../model/coupon.model');
    const { getUserModel } = require('../model/user.model');
    const { v4: uuidv4 } = require('uuid');
    const { seq } = require('../db/seq');
    const t = await seq.transaction();

    try {
      const Product = await getProductModel();
      const User = await getUserModel();

      // 1. 检查商品和用户
      const product = await Product.findByPk(productId, { transaction: t });
      if (!product) {
        throw new Error('商品不存在');
      }
      if (product.stock <= 0) {
        throw new Error('商品库存不足');
      }

      const user = await User.findByPk(userId, { transaction: t });
      if (!user) {
        throw new Error('用户不存在');
      }
      if (user.points < product.points_cost) {
        throw new Error('用户积分不足');
      }
      if (!user.mate_id) {
        throw new Error('用户没有情侣关系');
      }
      // 核心校验：确保兑换的商品是对方发布的
      if (product.publisher_id !== user.mate_id) {
        throw new Error('只能兑换对方发布的商品');
      }

      // 2. 扣减库存和积分
      await product.decrement('stock', { by: 1, transaction: t });
      await user.decrement('points', {
        by: product.points_cost,
        transaction: t,
      });

      // 3. 创建积分消费记录
      const Point = await getPointModel();
      await Point.create(
        {
          user_id: userId,
          type: 'spend',
          amount: product.points_cost,
          description: `兑换商品: ${product.name}`,
          related_id: productId,
        },
        { transaction: t },
      );

      // 4. 创建优惠券
      const Coupon = await getCouponModel();
      let expires_at = null;
      if (product.validity_period) {
        expires_at = new Date();
        expires_at.setDate(expires_at.getDate() + product.validity_period);
      }
      const newCoupon = await Coupon.create(
        {
          card_id: uuidv4(),
          couple_link_id: user.couple_link_id,
          user_id: userId,
          product_id: productId,
          status: 'unused',
          expires_at: expires_at,
        },
        { transaction: t },
      );

      await t.commit();
      return newCoupon.dataValues;
    } catch (error) {
      await t.rollback();
      // 重新抛出错误，让controller层捕获
      throw error;
    }
  }
}

module.exports = new ProductService();
