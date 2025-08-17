const couponService = require('../service/coupon.service');
const { accessController } = require('../utils/console.utils');
const { FETCH_SUCCESS, SUCCESS } = require('../constant/succuss.type');
const { couponError } = require('../constant/err.type');

class CouponController {
  /**
   * 获取我自己的优惠券列表
   */
  async getMyCoupons(ctx) {
    accessController('getMyCoupons');
    const { id: user_id } = ctx.state.user;
    const { status } = ctx.query;

    const where = { user_id };
    if (status) {
      where.status = status;
    }

    try {
      const coupons = await couponService.findCoupons(where);
      ctx.body = {
        ...FETCH_SUCCESS,
        msg: '获取优惠券列表成功',
        data: coupons,
      };
    } catch (error) {
      console.error('获取优惠券列表失败:', error);
      ctx.app.emit('error', couponError.findError, ctx);
    }
  }

  /**
   * 获取TA的优惠券列表
   */
  async getUserCoupons(ctx) {
    accessController('getUserCoupons');
    try {
      const { userId } = ctx.params;
      const { status } = ctx.query;
      const where = { user_id: userId };
      if (status) {
        where.status = status;
      }
      const coupons = await couponService.findCoupons(where);
      ctx.body = {
        ...FETCH_SUCCESS,
        msg: '获取TA的优惠券列表成功',
        data: coupons,
      };
    } catch (error) {
      console.error('获取TA的优惠券列表失败:', error);
      ctx.app.emit('error', couponError.findError, ctx);
    }
  }

  /**
   * 发起核销（持券方）
   */
  async useCoupon(ctx) {
    accessController('useCoupon');
    try {
      const { id: userId } = ctx.state.user;
      const { card_id } = ctx.request.body;
      const res = await couponService.useCoupon(card_id, userId);
      ctx.body = { ...SUCCESS, msg: '发起核销请求成功', result: res };
    } catch (err) {
      console.error(err);
      ctx.app.emit('error', couponError.useFailed, ctx);
    }
  }

  /**
   * 确认核销（发行方）
   */
  async confirmCoupon(ctx) {
    accessController('confirmCoupon');
    try {
      const { id: verifierId } = ctx.state.user;
      const { card_id } = ctx.request.body;
      const res = await couponService.confirmCoupon(card_id, verifierId);
      ctx.body = { ...SUCCESS, msg: '确认核销成功', result: res };
    } catch (err) {
      console.error(err);
      ctx.app.emit('error', couponError.confirmFailed, ctx);
    }
  }
}

module.exports = new CouponController();
