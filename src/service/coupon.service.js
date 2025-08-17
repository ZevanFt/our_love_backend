// 引入从 console.utils.js 文件中导出的 accessService 函数，用于记录服务访问日志
const { accessService } = require('../utils/console.utils');
const { getCouponModel } = require('../model/coupon.model');

/**
 * CouponService 类，封装了与优惠券相关的数据库操作服务
 */
class CouponService {
  // 在这里添加与优惠券相关的方法
  async test() {
    accessService('test');
    const Coupon = await getCouponModel();
    console.log(Coupon);
  }
}

// 创建 CouponService 类的实例
const couponServiceInstance = new CouponService();
// 导出 CouponService 类的实例，供其他模块使用
module.exports = couponServiceInstance;
