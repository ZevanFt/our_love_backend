// 引入从 console.utils.js 文件中导出的 accessService 函数，用于记录服务访问日志
const { accessService } = require('../utils/console.utils');
const { getCouponModel } = require('../model/coupon.model');

/**
 * CouponService 类，封装了与优惠券相关的数据库操作服务
 */
class CouponService {
  // 在这里添加与优惠券相关的方法
  /**
   * 查找优惠券
   * @param {object} where - 查询条件
   * @returns {Promise<object|null>} - 优惠券列表或null
   */
  async findCoupons(where) {
    accessService('findCoupons');
    const Coupon = await getCouponModel();
    const coupons = await Coupon.findAll({ where });
    return coupons;
  }

  async useCoupon(card_id, userId) {
    accessService('useCoupon');
    const Coupon = await getCouponModel();
    const coupon = await Coupon.findOne({ where: { card_id } });

    if (!coupon) throw new Error('卡券不存在');
    if (coupon.user_id !== userId) throw new Error('你不是此卡券的持有者');
    if (coupon.status !== 'unused') throw new Error('卡券状态异常，无法使用');
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      await coupon.update({ status: 'expired' });
      throw new Error('卡券已过期');
    }

    const res = await coupon.update({ status: 'pending_confirmation' });
    return res.dataValues;
  }

  async confirmCoupon(card_id, verifierId) {
    accessService('confirmCoupon');
    const Coupon = await getCouponModel();
    const Product = await require('../model/product.model').getProductModel();
    const coupon = await Coupon.findOne({
      where: { card_id },
      include: [
        {
          model: Product,
        },
      ],
    });

    if (!coupon) throw new Error('卡券不存在');
    if (!coupon.product || coupon.product.publisher_id !== verifierId) {
      throw new Error('你无权核销此卡券');
    }
    if (coupon.status !== 'pending_confirmation')
      throw new Error('卡券状态异常，无法确认核销');

    const res = await coupon.update({
      status: 'redeemed',
      used_at: new Date(),
      verifier_id: verifierId,
    });
    return res.dataValues;
  }
}

// 创建 CouponService 类的实例
const couponServiceInstance = new CouponService();
// 导出 CouponService 类的实例，供其他模块使用
module.exports = couponServiceInstance;
